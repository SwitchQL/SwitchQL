import ConnData from "../models/connData";

import PgSqlProvider from "./Generators/classes/pgSqlProvider";
import pgSqlRetriever from "./DBMetadata/pgMetadataRetriever";

const processMetaData = require("./DBMetadata/metadataProcessor");
import { pgSQL, msSQL} from "./DBMetadata/columnTypeTranslators";

import MSSqlProvider from "./Generators/classes/msSqlProvider";
import msSqlRetriever from "./DBMetadata/msMetadataRetriever";
import DBType from "../models/dbType";

function dbFactory (connData: ConnData) {
	let connString = "";
	switch (connData.type) {
		case DBType.PostgreSQL:
			connString = connData.value.length === 0 ? pgSqlRetriever.buildConnectionString(connData) : connData.value;

			return {
				retriever: pgSqlRetriever,
				processMetaData: processMetaData(pgSQL),
				provider: new PgSqlProvider(connString),
			};

		case DBType.SQLServer:
			return {
				retriever: msSqlRetriever,
				processMetaData: processMetaData(msSQL),
				provider: new MSSqlProvider(),
			};

		default:
			throw new Error(`Provider for ${connData.type} has not been implemented`);
	}
}

export default dbFactory;
