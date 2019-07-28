import ProcessedField from "./processedField";
import { removeWhitespace } from "../server/util";

class ProcessedTable {
	displayName: string

	constructor (public name: string, public fields: ProcessedField[]) {
	/**
     * displayName is used for all graph ql code as the name is normalized
     * to remove spaces, while name is used for database queries to preserve
     * the original table name
     */
		this.displayName = removeWhitespace(name);
	}

	addField (field: ProcessedField) {
		this.fields.push(field);
	}
}

export default ProcessedTable;
