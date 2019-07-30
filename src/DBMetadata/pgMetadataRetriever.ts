import ConnData from '../models/connData';
import * as pgInit from 'pg-promise'
import { createHash } from 'crypto'
import { promiseTimeout } from '../util'
import DBMetadata from '../models/dbMetadata';



const pgp = pgInit();
const poolCache: { [key: string]: pgInit.IDatabase<{}> } = {};

const metadataQuery = `SELECT
                          t.table_name as tableName,
                          c.column_name as columnName,
                          c.is_nullable as isNullable,
                          c.data_type as dataType,
                          c.character_maximum_length as characterMaximumLength,
                          tc.constraint_type as constraintType,
                          ccu.table_name AS foreignTableName,
                          ccu.column_name AS foreignColumnName
                        FROM
                          information_schema.tables AS t JOIN information_schema.columns as c
                            ON t.table_name = c.table_name
                          LEFT JOIN information_schema.key_column_usage as kcu
                            ON t.table_name = kcu.table_name AND c.column_name = kcu.column_name
                          LEFT JOIN information_schema.table_constraints as tc
                            ON kcu.constraint_name = tc.constraint_name
                          LEFT JOIN information_schema.constraint_column_usage AS ccu 
                            ON tc.constraint_name = ccu.constraint_name
                        WHERE table_type = 'BASE TABLE'
                          AND t.table_schema = 'public'
                          AND (constraint_type = 'FOREIGN KEY' or (constraint_type is null OR constraint_type <> 'FOREIGN KEY'))
                        ORDER BY t.table_name`;

function getDbPool (connString: string): pgInit.IDatabase<{}> {
    const hash = createHash('sha256');
    hash.update(connString);

    const digest = hash.digest('base64');

    if (poolCache[digest]) {
        return poolCache[digest];
    }

    const db = pgp(connString);
    poolCache[digest] = db;

    return db;
}

function removeFromCache (connString: string): void {
    const hash = createHash('sha256');
    hash.update(connString);

    delete poolCache[hash.digest('base64')];
}

async function getSchemaInfo (connString: string): Promise<DBMetadata[]> {
    const db = getDbPool(connString);
    try {
        const metadataInfo = await promiseTimeout(
            10000,
            db.any(metadataQuery)
        );

        return metadataInfo;
    } catch (err) {
        removeFromCache(connString);
        throw err;
    }
}



function buildConnectionString (info: ConnData): string {
    let connectionString = '';
    const port = info.port || 5432;
    connectionString += `postgres://${info.user}:${info.password}@${
        info.host
    }:${port}/${info.database}`;
    return connectionString;
}

export default {
    getSchemaInfo: getSchemaInfo,
    buildConnectionString,
};
