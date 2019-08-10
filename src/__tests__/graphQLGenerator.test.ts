/* eslint-disable no-undef */
import generateGraphQL from '../Generators/graphQLGenerator';
import input from './sampleFiles/processedMetadata';
import PgSqlProvider from '../Generators/provider/pgSqlProvider';

describe('Mutation Generation Tests', () => {
    it('Should return an empty string on empty input', () => {
        const { mutations: result } = generateGraphQL(
            {},
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );
        expect(result).toBe('');
    });

    it('Should match the snapshot', () => {
        const { mutations: result } = generateGraphQL(
            input.tables as any,
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );
        expect(result).toMatchSnapshot();
    });
});

describe('Query Generation Tests', () => {
    it('Should return an empty string on empty input', () => {
        const { queries: result } = generateGraphQL(
            {},
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );
        expect(result).toBe('');
    });

    it('Should match the snapshot', () => {
        const { queries: result } = generateGraphQL(
            input.tables as any,
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );
        expect(result).toMatchSnapshot();
    });
});

describe('Type generation tests', () => {
    it('Should match the snapshot', () => {
        const { types: output } = generateGraphQL(
            input.tables as any,
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );

        expect(output).toMatchSnapshot();
    });

    it('Should load binary data into a buffer for insert mutations', () => {
        const tables = input.tables;
        tables[0].fields.push({
            name: 'binaryCol',
            type: 'IntegerList',
            primaryKey: false,
            unique: false,
            required: true,
            inRelationship: false,
            relation: {
            },
            tableNum: 0,
            fieldNum: 2,
        })

        const { types: output } = generateGraphQL(
            input.tables as any,
            new PgSqlProvider('postgres://test@test.com:5432/test')
        );

        expect(output).toMatchSnapshot();
    })
});
