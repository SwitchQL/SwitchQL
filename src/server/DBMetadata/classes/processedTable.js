class ProcessedTable {
	constructor (name, fields) {
		this.name = name;
		this.fields = fields;
	}

	addField (field) {
		this.fields.push(field);
	}
}

module.exports = ProcessedTable;
