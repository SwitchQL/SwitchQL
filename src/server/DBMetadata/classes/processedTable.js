const util = require("../../util");

class ProcessedTable {
	constructor (name, fields) {
		this.name = util.removeWhitespace(name);
		this.fields = fields;
	}

	addField (field) {
		this.fields.push(field);
	}
}

module.exports = ProcessedTable;
