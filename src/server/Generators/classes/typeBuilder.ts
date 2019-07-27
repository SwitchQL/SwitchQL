import IDBProvider from "./dbProvider";

/* eslint-disable no-return-assign */
const util = require("../../util");
const tab = `  `;

// TODO pull in private classes
class TypeBuilder {
	private graphqlCode: string
	private typeSchemaCode: string
	private rootQueryCode: string
	private mutationCode: string

	constructor (private provider: IDBProvider) {
		this.graphqlCode = init(this.provider);
		this.typeSchemaCode = "";
		this.rootQueryCode = `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`;
		this.mutationCode = `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;
	}

	build () {
		this.rootQueryCode += `\n${tab}}\n});\n\n`;
		this.mutationCode += `\n${tab}}\n});\n\n`;

		this.graphqlCode +=
      this.typeSchemaCode + this.rootQueryCode + this.mutationCode;

		this.graphqlCode += this.provider.configureExport();

		return this.graphqlCode;
	}

	// TODO add strong typing
	addGraphqlTypeSchema (table: any, processedMetadata: any) {
		let subQuery = "";

		let typeQuery = `const ${
			table.displayName
		}Type = new GraphQLObjectType({\n${tab}name: '${
			table.displayName
		}',\n${tab}fields: () => ({`;

		let firstLoop = true;

		for (const field of table.fields) {
			if (!firstLoop) typeQuery += ",";

			// check the field current name and give it a graphQL type
			typeQuery += `\n${tab.repeat(2)}${
				field.name
			}: { type: ${tableDataTypeToGraphqlType(field.type)} }`;

			// later try to maintain the foreign key field to be the primary value?? NO
			if (field.inRelationship) {
				subQuery += `${this.createSubQuery(field, processedMetadata)}, `;
			}

			firstLoop = false;
		}
		if (subQuery !== "") typeQuery += ",";
		typeQuery += subQuery.slice(0, -2);
		typeQuery += `\n${tab}})\n});\n\n`;

		this.typeSchemaCode += typeQuery;

		return this;
	}

	// TODO add strong typing
	createSubQuery (column: any, processedMetadata: any) {
		const subqueries = [];

		for (const relatedTableIndex in column.relation) {
			let subQuery = "";

			const relatedTableLookup = relatedTableIndex.split(".");

			const { displayName: rtDisplayName, name: rtName } = processedMetadata[
				relatedTableLookup[0]
			];

			const relatedFieldName =
        processedMetadata[relatedTableLookup[0]].fields[relatedTableLookup[1]].name;

			const relatedTableRelationType =
        column.relation[relatedTableIndex].refType;

			subQuery += `\n${tab.repeat(2)}${createSubQueryName(
				relatedTableRelationType,
				rtDisplayName
			)}: {\n${tab.repeat(3)}type: `;

			if (relatedTableRelationType === "one to many") {
				subQuery += `new GraphQLList(${rtDisplayName}Type),`;
			} else {
				subQuery += `${rtDisplayName}Type,`;
			}
			subQuery += `\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

			subQuery += this.provider.selectWithWhere(
				rtName,
				relatedFieldName,
				`parent.${column.name}`,
				relatedTableRelationType === "one to many"
			);

			subQuery += "\n";
			subQuery += `${tab.repeat(3)}}\n`;
			subQuery += `${tab.repeat(2)}}`;

			subqueries.push(subQuery);
		}

		return subqueries.join(", ");
	}

	// TODO add strong typing
	addGraphqlRootCode (table: any) {
		let rootQuery = "";

		rootQuery += this.createFindAllRootQuery(table);

		// primarykey id is not always the first field in our data
		for (const field of table.fields) {
			if (field.primaryKey) {
				rootQuery += this.createFindByIdQuery(table, field);
			}
		}

		this.rootQueryCode += rootQuery;
		return this;
	}

	// TODO add strong typing
	createFindAllRootQuery (table: any) {
		let rootQuery = `${tab.repeat(2)}every${util.toTitleCase(
			table.displayName
		)}: {\n${tab.repeat(3)}type: new GraphQLList(${
			table.displayName
		}Type),\n${tab.repeat(3)}resolve() {\n${tab.repeat(4)}`;

		rootQuery += this.provider.select(table.name);

		return rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
	}

	// TODO add strong typing
	createFindByIdQuery (table: any, idColumn: any) {
		let rootQuery = `,\n${tab.repeat(
			2
		)}${table.displayName.toLowerCase()}: {\n${tab.repeat(3)}type: ${
			table.displayName
		}Type,\n${tab.repeat(3)}args: {\n${tab.repeat(4)}${
			idColumn.name
		}: { type: ${tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
			3
		)}},\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

		rootQuery += this.provider.selectWithWhere(
			table.name,
			idColumn.name,
			`args.${idColumn.name}`,
			false
		);

		return rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
	}

	// TODO add strong typing
	addGraphqlMutationCode (table: any) {
		let mutationQuery = ``;
		mutationQuery += `${this.addMutation(table)}`;
		if (table.fields[0]) {
			mutationQuery += `,\n${this.updateMutation(table)},\n`;
			mutationQuery += `${this.deleteMutation(table)}`;
		}

		this.mutationCode += mutationQuery;
		return this;
	}

	// TODO add strong typing
	addMutation (table: any) {
		let mutationQuery = `${tab.repeat(2)}add${util.toTitleCase(
			table.displayName
		)}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
			3
		)}args: {\n`;

		let fieldNames = "";
		let argNames = "";

		let firstLoop = true;

		for (const field of table.fields) {
			if (!firstLoop) mutationQuery += ",\n";
			firstLoop = false;

			// dont need the ID for adding new row because generated in SQL
			if (!field.primaryKey) {
				mutationQuery += `${tab.repeat(4)}${field.name}: ${buildMutationArgType(
					field
				)}`;
				fieldNames += `${field.name}, `;
				argNames += `\${args.${field.name}}, `;
			} else {
				firstLoop = true;
			}
		}

		fieldNames = fieldNames.slice(0, -2);
		argNames = argNames.slice(0, -2);
		mutationQuery += `\n${tab.repeat(3)}},\n${tab.repeat(
			3
		)}resolve(parent, args) {\n${tab.repeat(4)}`;

		mutationQuery += this.provider.insert(table.name, fieldNames, argNames);

		return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
	}

	// TODO add strong typing
	updateMutation (table: any) {
		let idColumnName;

		for (const field of table.fields) {
			if (field.primaryKey) {
				idColumnName = field.name;
			}
		}

		let mutationQuery = `${tab.repeat(2)}update${util.toTitleCase(
			table.displayName
		)}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
			3
		)}args: {\n`;

		let firstLoop = true;
		for (const field of table.fields) {
			if (!firstLoop) mutationQuery += ",\n";
			firstLoop = false;

			mutationQuery += `${tab.repeat(4)}${field.name}: ${buildMutationArgType(
				field
			)}`;
		}

		mutationQuery += `\n${tab.repeat(3)}},\n${tab.repeat(
			3
		)}resolve(parent, args) {\n`;

		mutationQuery += `${tab.repeat(
			4
		)}const { ${idColumnName}, ...rest } = args;\n`;
		mutationQuery += this.provider.parameterize();

		mutationQuery += `${tab.repeat(4)}${this.provider.update(
			table.name,
			idColumnName
		)}`;

		return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
	}

	// TODO add strong typing
	deleteMutation (table: any) {
		let idColumn;

		for (const field of table.fields) {
			if (field.primaryKey) {
				idColumn = field;
			}
		}

		let mutationQuery = `${tab.repeat(2)}delete${util.toTitleCase(
			table.displayName
		)}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
			3
		)}args: {\n${tab.repeat(4)}${
			idColumn.name
		}: { type: ${tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
			3
		)}},\n${tab.repeat(3)}resolve(parent, args) {\n`;

		mutationQuery += `${tab.repeat(4)}${this.provider.delete(
			table.name,
			idColumn.name
		)}`;

		return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
	}

	// TODO add strong typing
	addNewLine (codeSegment: string) {
		(<any>this)[codeSegment] += ",\n";
	}
}

// TODO add strong typing
function createSubQueryName (relationType: any, relatedTable: any) {
	switch (relationType) {
		case "one to one":
			return `related${util.toTitleCase(relatedTable)}`;

		case "one to many":
			return `everyRelated${util.toTitleCase(relatedTable)}`;

		case "many to one":
			return `related${util.toTitleCase(relatedTable)}`;

		default:
			return `everyRelated${util.toTitleCase(relatedTable)}`;
	}
}

function init (dbProvider: IDBProvider) {
	let str = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;
	str += dbProvider.connection();

	str += `\nconst { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull
} = graphql;
  \n`;

	str += `const { 
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = graphql_iso_date;
  \n`;

	return str;
}

function tableDataTypeToGraphqlType (type: string) {
	switch (type) {
		case "ID":
			return "GraphQLID";
		case "String":
			return "GraphQLString";
		case "Integer":
			return "GraphQLInt";
		case "Float":
			return "GraphQLFloat";
		case "Boolean":
			return "GraphQLBoolean";
		case "Date":
			return "GraphQLDate";
		case "Time":
			return "GraphQLTime";
		case "DateTime":
			return "GraphQLDateTime";
		default:
			return "GraphQLString";
	}
}

// TODO add strong typing
function buildMutationArgType (column: any) {
	const mutationQuery = `{ type: ${checkifColumnRequired(
		column.required,
		"front"
	)}${tableDataTypeToGraphqlType(column.type)}${checkifColumnRequired(
		column.required,
		"back"
	)} }`;
	return mutationQuery;
}

function checkifColumnRequired (required: boolean, position: string) {
	if (required) {
		if (position === "front") {
			return "new GraphQLNonNull(";
		}
		return ")";
	}
	return "";
}

export default TypeBuilder;
