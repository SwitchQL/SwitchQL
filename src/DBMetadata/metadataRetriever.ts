import DBMetadata from '../models/dbMetadata';
import ConnData from '../models/connData';

interface IMetadataRetriever {
    getSchemaInfo(connString: string, schema?: string): Promise<DBMetadata[]>;
    buildConnectionString(info: ConnData): string;
}

export default IMetadataRetriever