const PgSqlProvider = require("./Generators/classes/pgSqlProvider");
const pgSqlRetriever = require("./DBMetadata/pgsql/pgMetadataRetriever");

const processMetaData = require("./DBMetadata/metadataProcessor");
const translators = require("./DBMetadata/columnTypeTranslators");

const MSSqlProvider = require("./Generators/classes/msSqlProvider");
const msSqlRetriever = require("./DBMetadata/mssql/msMetadataRetriever");

function dbFactory (connData) {
	switch (connData.type) {
		case "PostgreSQL":
			const connString =
        connData.value.length === 0 ?
        	pgSqlRetriever.buildConnectionString(info) :
        	connData.value;

			return {
				retriever: pgSqlRetriever,
				processMetaData: processMetaData(translators.pgSQL),
				provider: new PgSqlProvider(connString),
			};

		case "SQLServer":
			return {
				retriever: msSqlRetriever,
				processMetaData: processMetaData(translators.msSQL),
				provider: new MSSqlProvider(),
			};

		default:
			throw new Error(`Provider for ${connData.type} has not been implemented`);
	}
}

module.exports = dbFactory;
