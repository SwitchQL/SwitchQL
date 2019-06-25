const PgSqlProvider = require("./Generators/classes/pgSqlProvider");
const pgSqlRetriever = require("./DBMetadata/pgsql/pgMetadataRetriever");

const processMetaData = require("./DBMetadata/metadataProcessor");
const translators = require("./DBMetadata/columnTypeTranslators");

const MSSqlProvider = require("./Generators/classes/msSqlProvider");
const msSqlRetriever = require("./DBMetadata/mssql/msMetadataRetriever");

const MySqlProvider = require("./Generators/classes/mysqlProvider");
const mySqlRetriever = require("./DBMetadata/mysql/mysqlMetadataRetriever");

function dbFactory(connData) {
  console.log(connData.type);
  switch (connData.type) {
    case "PostgreSQL":
      const connString =
        connData.value.length === 0
        ? pgSqlRetriever.buildConnectionString(info)
        : connData.value;

      return {
        retriever: pgSqlRetriever,
        translator: translators.pgSQL,
        provider: new PgSqlProvider(connString)
      };

    case "SQLServer":
      return {
        retriever: msSqlRetriever,
        translator: translators.msSQL,
        provider: new MSSqlProvider()
      };

    case "MySQL":
      /* TODO build connData.value if necessary */
      ret = {
        retriever: mySqlRetriever,
        translator: translators.mySQL,
        provider: new MySqlProvider(connData.value)
      };
      console.log(ret)
      return(ret);

    default:
      throw new Error(`Provider for ${connData.type} has not been implemented`);
  }
}

module.exports = dbFactory;
