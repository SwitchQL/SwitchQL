const TypeBuilder = require("./classes/typeBuilder");
const MutationBuilder = require("./classes/mutationBuilder");
const QueryBuilder = require("./classes/queryBuilder");

function generateGraphQL (tables, dbProvider) {
	if (Object.keys(tables).length == 0) { return { types: "", mutations: "", queries: "" }; }

	const queryBuilder = new QueryBuilder();
	const typeBuilder = new TypeBuilder(dbProvider);
	const mutationBuilder = new MutationBuilder();

	let firstLoop = true;

	for (const table of Object.values(tables)) {
		queryBuilder.addQuery(table);
		mutationBuilder.addMutation(table);

		typeBuilder.addGraphqlTypeSchema(table, tables);

		if (!firstLoop) typeBuilder.addNewLine("rootQueryCode");
		typeBuilder.addGraphqlRootCode(table);

		if (!firstLoop) typeBuilder.addNewLine("mutationCode");
		typeBuilder.addGraphqlMutationCode(table);

		firstLoop = false;
	}

	return {
		types: typeBuilder.build(),
		mutations: mutationBuilder.build(),
		queries: queryBuilder.build(),
	};
}

module.exports = generateGraphQL;
