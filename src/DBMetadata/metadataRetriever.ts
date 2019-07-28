import DBMetadata from "../models/dbMetadata";
import ConnData from "../models/connData";

interface IMetadataRetriever {
    getSchemaInfo(connString: string): Promise<DBMetadata[]>
    buildConnectionString(info: ConnData): string
}

export default IMetadataRetriever