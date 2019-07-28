/* eslint-disable no-return-assign */
import { toTitleCase } from '../../util'
import ProcessedTable from '../../../models/processedTable';
import ProcessedField from '../../../models/processedField';

const tab = `  `;

// TODO pull in private methods
class QueryBuilder {
	private query = "import { gql } from 'apollo-boost';\n\n";
	private exportNames: string[] = []

	addQuery (table: ProcessedTable) {
		this.query += buildAllQuery(table);
		this.exportNames.push(`queryEvery${toTitleCase(table.displayName)}`);

		for (const field of table.fields) {
			if (field.primaryKey) {
				this.query += buildQueryById(table, field);
				this.exportNames.push(
					`query${toTitleCase(table.displayName)}ById `
				);
			}
		}

		return this;
	}

	build () {
		const endString = this.exportNames.reduce((acc, curr, i) => i === this.exportNames.length - 1 ?
			acc += `${tab}${curr}\n` :
			acc += `${tab}${curr},\n`, "export {\n");

		this.query += `${endString}};`;
		return this.query;
	}
}

function buildAllQuery (table: ProcessedTable) {
	let string = `const queryEvery${toTitleCase(
		table.displayName
	)} = gql\`\n`;
	string += `${tab}{\n`;
	string += `${tab.repeat(2)}every${toTitleCase(table.displayName)} {\n`;

	for (const field of table.fields) {
		string += `${tab.repeat(3)}${field.name}\n`;
	}

	return string += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
}

function buildQueryById (table: ProcessedTable, idField: ProcessedField) {
	let query = `const query${toTitleCase(table.displayName)}ById = gql\`\n`;
	query += `${tab}query($${table.displayName}: ${idField.type}!) {\n`;
	query += `${tab.repeat(2)}${table.displayName}(${idField.name}: $${
		table.displayName
	}) {\n`;

	for (const field of table.fields) {
		query += `${tab.repeat(3)}${field.name}\n`;
	}

	query += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
	return query;
}

export default QueryBuilder;
