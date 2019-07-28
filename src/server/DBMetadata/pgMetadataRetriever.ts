import ConnData from "../../models/connData";
import * as pgInit from 'pg-promise'
import { createHash } from 'crypto'
import { promiseTimeout } from '../util'



const pgp = pgInit();
const poolCache: { [key: string]: pgInit.IDatabase<{}> } = {};

const metadataQuery = `SELECT
                          t.table_name,
                          c.column_name,
                          c.is_nullable,
                          c.data_type,
                          c.character_maximum_length,
                          tc.constraint_type,
                          ccu.table_name AS foreign_table_name,
                          ccu.column_name AS foreign_column_name
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

async function getSchemaInfo (connString: string) {
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

function getDbPool (connString: string) {
	const hash = createHash("sha256");
	hash.update(connString);

	const digest = hash.digest("base64");

	if (poolCache[digest]) {
		return poolCache[digest];
	}

	const db = pgp(connString);
	poolCache[digest] = db;

	return db;
}

function removeFromCache (connString: string) {
	const hash = createHash("sha256");
	hash.update(connString);

	delete poolCache[hash.digest("base64")];
}

function buildConnectionString (info: ConnData) {
	let connectionString = "";
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
