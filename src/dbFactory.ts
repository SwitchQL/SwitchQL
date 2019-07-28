import ConnData from "./models/connData";

import PgSqlProvider from "./Generators/provider/pgSqlProvider";
import pgSqlRetriever from "./DBMetadata/pgMetadataRetriever";

import processMetaData from "./DBMetadata/metadataProcessor";
import { pgSQL, msSQL} from "./DBMetadata/columnTypeTranslators";

import MSSqlProvider from "./Generators/provider/msSqlProvider";
import msSqlRetriever from "./DBMetadata/msMetadataRetriever";
import DBType from "./models/dbType";
import IMetadataRetriever from "./DBMetadata/metadataRetriever";
import IDBProvider from "./Generators/provider/dbProvider";

function dbFactory (connData: ConnData): { 
	retriever: IMetadataRetriever, 
	processMetaData: Function, 
	provider: IDBProvider
} {
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
