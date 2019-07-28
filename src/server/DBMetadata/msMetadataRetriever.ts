import { ConnectionPool } from 'mssql'
import { createHash } from "crypto";
import ConnData from "../../models/connData";

const poolCache: { [ key: string]: ConnectionPool } = {};

const query = `select 
                    c.table_name, 
                    c.column_name, 
                    c.is_nullable, 
                    c.data_type, 
                    c.character_maximum_length,
                    tc.constraint_type,
                    kcu.TABLE_NAME as foreign_table_name,
                    kcu.COLUMN_NAME as foreign_column_name
                from Northwind.INFORMATION_SCHEMA.COLUMNS c
                left outer join Northwind.INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE cu
                    on c.TABLE_CATALOG = cu.TABLE_CATALOG 
                    and c.TABLE_SCHEMA = cu.TABLE_SCHEMA 
                    and c.TABLE_NAME = cu.TABLE_NAME 
                    and c.COLUMN_NAME = cu.COLUMN_NAME
                left outer join Northwind.INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                    on cu.TABLE_CATALOG = tc.TABLE_CATALOG 
                    and cu.TABLE_SCHEMA = tc.TABLE_SCHEMA 
                    and cu.TABLE_NAME = tc.TABLE_NAME  
                    and cu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
                left outer join Northwind.INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
                    on cu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME 
                left outer join Northwind.INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
                    on kcu.CONSTRAINT_NAME = rc.UNIQUE_CONSTRAINT_NAME 
                where (tc.CONSTRAINT_TYPE is null or tc.CONSTRAINT_TYPE in ('PRIMARY KEY', 'FOREIGN KEY'))
                    and exists (select * from Northwind.INFORMATION_SCHEMA.TABLES t 
                                    where t.TABLE_TYPE = 'BASE TABLE' and t.TABLE_NAME = c.TABLE_NAME )
                order by c.TABLE_NAME`;

async function getSchemaInfo (connString: string) {
	try {
		const pool = await getDbPool(connString);
		//TODO strongly type query
		const metadata = await pool.query(<any>query);

		return metadata.recordset;
	} catch (err) {
		removeFromCache(connString);
		throw err;
	}
}

function buildConnectionString (info: ConnData) {
	let connectionString = "";
	const port = info.port || 1433;

	// Per documentation request timeout cannot be less than 1 second
	connectionString += `mssql://${info.user}:${info.password}@${
		info.host
	}:${port}/${info.database}?encrypt=true&request%20timeout=${30000}`;
	return connectionString;
}

async function getDbPool (connString: string) {
	const hash = createHash("sha256");
	hash.update(connString);

	const digest = hash.digest("base64");

	if (poolCache[digest]) return poolCache[digest];

	const pool = await new ConnectionPool(connString).connect();
	// eslint-disable-next-line require-atomic-updates
	poolCache[digest] = pool;

	return pool;
}

function removeFromCache (connString: string) {
	const hash = createHash("sha256");
	hash.update(connString);

	delete poolCache[hash.digest("base64")];
}

export default {
	getSchemaInfo,
	buildConnectionString
};
