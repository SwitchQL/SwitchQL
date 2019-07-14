const pgp = require("pg-promise")();
const crypto = require("crypto");
const utilty = require("../util");

const poolCache = {};

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


async function getSchemaInfoPG (connString) {
	const db = getDbPool(connString);
	try {
		return metadataInfo = await utilty.promiseTimeout(10000, db.any(metadataQuery));
	} catch (err) {
		removeFromCache(connString);
		throw err;
	}
}

function getDbPool (connString) {
	const hash = crypto.createHash("sha256");
	hash.update(connString);

	const digest = hash.digest("base64");

	if (poolCache[digest]) {
		return poolCache[digest];
	}

	const db = pgp(connString);
	poolCache[digest] = db;

	return db;
}

function removeFromCache (connString) {
	const hash = crypto.createHash("sha256");
	hash.update(connString);

	delete poolCache[hash.digest("base64")];
}

function buildConnectionString (info) {
	let connectionString = "";
	info.port = info.port || 5432;
	connectionString += `postgres://${info.user}:${info.password}@${info.host}:${
		info.port
	}/${info.database}`;
	return connectionString;
}

module.exports = {
	getSchemaInfoPG,
	buildConnectionString,
};
