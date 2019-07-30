import MutationBuilder from './builder/mutationBuilder';
import DBProvider from './provider/dbProvider'
import ProcessedTable from '../models/processedTable';
import QueryBuilder from './builder/queryBuilder';
import TypeBuilder from './builder/typeBuilder';

function generateGraphQL (tables: { [key: number]: ProcessedTable }, dbProvider: DBProvider): {
    types: string;
    mutations: string;
    queries: string;
} {
    if (Object.keys(tables).length === 0) { return { types: '', mutations: '', queries: '' }; }

    const queryBuilder = new QueryBuilder();
    const typeBuilder = new TypeBuilder(dbProvider);
    const mutationBuilder = new MutationBuilder();

    let firstLoop = true;

    for (const table of Object.values(tables)) {
        queryBuilder.addQuery(table);
        mutationBuilder.addMutation(table);

        typeBuilder.addGraphqlTypeSchema(table, tables);

        if (!firstLoop) typeBuilder.addNewLine('rootQueryCode');
        typeBuilder.addGraphqlRootCode(table);

        if (!firstLoop) typeBuilder.addNewLine('mutationCode');
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
