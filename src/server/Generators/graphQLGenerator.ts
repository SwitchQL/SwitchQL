import TypeBuilder from "./classes/typeBuilder";
import MutationBuilder from "./classes/mutationBuilder";
import QueryBuilder from "./classes/queryBuilder";
import IDBProvider from './classes/dbProvider'
import ProcessedTable from '../DBMetadata/classes/processedTable';

function generateGraphQL (tables: { [ key: number]: ProcessedTable }, dbProvider: IDBProvider) {
	if (Object.keys(tables).length === 0) { return { types: "", mutations: "", queries: "" }; }

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

export default generateGraphQL;
