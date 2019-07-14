const util = require("../../util");
const tab = `  `;

class MutationBuilder {
	constructor () {
		this.mutation = `import { gql } from 'apollo-boost';\n\n`;
		this.exportNames = [];
	}

	addMutation (table) {
		this.mutation += buildMutationSignature(table, null, "add");
		this.mutation += buildTypeParams(table, null, "add");
		this.mutation += buildReturnValues(table);
		this.exportNames.push(`add${util.toTitleCase(table.displayName)}Mutation`);

		for (const field of table.fields) {
			if (field.primaryKey) {
				this.mutation += buildMutationSignature(table, field, "update");
				this.mutation += buildTypeParams(table, field, "update");
				this.mutation += buildReturnValues(table);
				this.exportNames.push(
					`update${util.toTitleCase(table.displayName)}Mutation`
				);

				this.mutation += buildMutationSignature(table, field, "delete");
				this.mutation += buildTypeParams(table, field, "delete");
				this.mutation += buildReturnValues(table);
				this.exportNames.push(
					`delete${util.toTitleCase(table.displayName)}Mutation`
				);
			}
		}

		return this;
	}

	build () {
		const endString = this.exportNames.reduce((acc, curr, i) => i === this.exportNames.length - 1 ?
			acc += `${tab}${curr}\n` :
			acc += `${tab}${curr},\n`, "export {\n");

		this.mutation += `${endString}};`;
		return this.mutation;
	}
}

function buildMutationSignature (table, idField, mutationType) {
	let mut = `const ${mutationType}${util.toTitleCase(
		table.displayName
	)}Mutation = gql\`\n${tab}mutation(`;

	if (mutationType === "delete") {
		mut += `$${idField.name}: ${idField.type}!) {\n${tab}`;
		return mut;
	}

	const params = [];

	for (const field of table.fields) {
		let param = "";

		if (mutationType === "update") {
			param += `$${field.name}: `;
			param += `${checkType(field.type)}`;
			param += `${checkRequired(field.required)}`;
		}

		if (mutationType === "add" && !field.primaryKey) {
			param += `$${field.name}: `;
			param += `${checkType(field.type)}`;
			param += `${checkRequired(field.required)}`;
		}

		if (param) params.push(param);
	}

	mut += `${params.join(", ")}) {\n${tab}`;
	return mut;
}

function checkType (fieldType) {
	if (fieldType === "Number") return "Int";
	else return fieldType;
}

function checkRequired (required) {
	if (required) return "!";
	return "";
}

function buildTypeParams (table, idField, mutationType) {
	let mut = `${tab}${mutationType}${util.toTitleCase(table.displayName)}(`;

	if (mutationType === "delete") {
		mut += `${idField.name}: $${idField.name}) {\n`;
		return mut;
	}

	const params = [];
	for (const field of table.fields) {
		let param = "";

		if (mutationType === "add" && !field.primaryKey) {
			param += `${field.name}: $${field.name}`;
		}

		if (mutationType === "update") {
			param += `${field.name}: $${field.name}`;
		}

		if (param) params.push(param);
	}

	mut += `${params.join(", ")}) {\n`;
	return mut;
}

function buildReturnValues (table) {
	let mut = "";

	for (const field of table.fields) {
		mut += `${tab.repeat(3)}${field.name}\n`;
	}

	mut += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
	return mut;
}

module.exports = MutationBuilder;
