const { removeWhitespace } = require("../../util");

class ProcessedTable {
	constructor (name, fields) {
		/**
     * displayName is used for all graph ql code as the name is normalized
     * to remove spaces, while name is used for database queries to preserve
     * the original table name
     */
		this.displayName = removeWhitespace(name);
		this.name = name;
		this.fields = fields;
	}

	addField (field) {
		this.fields.push(field);
	}
}

module.exports = ProcessedTable;
