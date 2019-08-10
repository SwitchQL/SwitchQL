/* eslint-disable no-return-assign */
import { toTitleCase } from '../../util';
import ProcessedTable from '../../models/processedTable';
import IDBProvider from '../provider/dbProvider';
import ProcessedField from '../../models/processedField';

const tab = `  `;

class TypeBuilder {
    private graphqlCode: string
    private typeSchemaCode: string
    private rootQueryCode: string
    private mutationCode: string

    constructor(private provider: IDBProvider) {
        this.graphqlCode = this.init();
        this.typeSchemaCode = '';
        this.rootQueryCode = `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`;
        this.mutationCode = `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;
    }

    build() {
        this.rootQueryCode += `\n${tab}}\n});\n\n`;
        this.mutationCode += `\n${tab}}\n});\n\n`;

        this.graphqlCode +=
            this.typeSchemaCode + this.rootQueryCode + this.mutationCode;

        this.graphqlCode += this.provider.configureExport();

        return this.graphqlCode;
    }

    addGraphqlTypeSchema(table: ProcessedTable, processedMetadata: { [key: number]: ProcessedTable }) {
        let subQuery = '';

        let typeQuery = `const ${
            table.displayName
            }Type = new GraphQLObjectType({\n${tab}name: '${
            table.displayName
            }',\n${tab}fields: () => ({`;

        let firstLoop = true;

        for (const field of table.fields) {
            if (!firstLoop) typeQuery += ',';

            // check the field current name and give it a graphQL type
            typeQuery += `\n${tab.repeat(2)}${
                field.name
                }: { type: ${this.tableDataTypeToGraphqlType(field.type)} }`;

            // later try to maintain the foreign key field to be the primary value?? NO
            if (field.inRelationship) {
                subQuery += `${this.createSubQuery(field, processedMetadata)}, `;
            }

            firstLoop = false;
        }
        if (subQuery !== '') typeQuery += ',';
        typeQuery += subQuery.slice(0, -2);
        typeQuery += `\n${tab}})\n});\n\n`;

        this.typeSchemaCode += typeQuery;

        return this;
    }

    private createSubQuery(column: ProcessedField, processedMetadata: { [key: number]: ProcessedTable }) {
        const subqueries = [];

        for (const rel in column.relation) {
            let subQuery = '';

            const [relatedTableIdx, relatedColIdx] = rel.split('.').map(i => parseInt(i));

            const { displayName: rtDisplayName, name: rtName } = processedMetadata[relatedTableIdx];

            const relatedFieldName = processedMetadata[relatedTableIdx].fields[relatedColIdx].name;

            const relatedTableRelationType = column.relation[rel].refType;

            subQuery += `\n${tab.repeat(2)}${this.createSubQueryName(
                relatedTableRelationType,
                rtDisplayName
            )}: {\n${tab.repeat(3)}type: `;

            if (relatedTableRelationType === 'one to many') {
                subQuery += `new GraphQLList(${rtDisplayName}Type),`;
            } else {
                subQuery += `${rtDisplayName}Type,`;
            }
            subQuery += `\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

            subQuery += this.provider.selectWithWhere(
                rtName,
                relatedFieldName,
                `parent.${column.name}`,
                relatedTableRelationType === 'one to many'
            );

            subQuery += '\n';
            subQuery += `${tab.repeat(3)}}\n`;
            subQuery += `${tab.repeat(2)}}`;

            subqueries.push(subQuery);
        }

        return subqueries.join(', ');
    }

    addGraphqlRootCode(table: ProcessedTable) {
        let rootQuery = '';

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

    private createFindAllRootQuery(table: ProcessedTable) {
        let rootQuery = `${tab.repeat(2)}every${toTitleCase(
            table.displayName
        )}: {\n${tab.repeat(3)}type: new GraphQLList(${
            table.displayName
            }Type),\n${tab.repeat(3)}resolve() {\n${tab.repeat(4)}`;

        rootQuery += this.provider.select(table.name);

        return rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
    }

    private createFindByIdQuery(table: ProcessedTable, idColumn: ProcessedField) {
        let rootQuery = `,\n${tab.repeat(
            2
        )}${table.displayName.toLowerCase()}: {\n${tab.repeat(3)}type: ${
            table.displayName
            }Type,\n${tab.repeat(3)}args: {\n${tab.repeat(4)}${
            idColumn.name
            }: { type: ${this.tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
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

    addGraphqlMutationCode(table: ProcessedTable) {
        let mutationQuery = ``;
        mutationQuery += `${this.addMutation(table)}`;
        if (table.fields[0]) {
            mutationQuery += `,\n${this.updateMutation(table)},\n`;
            mutationQuery += `${this.deleteMutation(table)}`;
        }

        this.mutationCode += mutationQuery;
        return this;
    }

    private addMutation(table: ProcessedTable) {
        let mutationQuery = `${tab.repeat(2)}add${toTitleCase(
            table.displayName
        )}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
            3
        )}args: {\n`;

        let fieldNames = '';
        let argNames = '';

        let firstLoop = true;

        for (const field of table.fields) {
            if (!firstLoop) mutationQuery += ',\n';
            firstLoop = false;

            // dont need the ID for adding new row because generated in SQL
            if (!field.primaryKey) {
                mutationQuery += `${tab.repeat(4)}${field.name}: ${this.buildMutationArgType(
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

        mutationQuery += this.loadBinaryDataToBuffer(table.fields);
        mutationQuery += this.provider.insert(table.name, fieldNames, argNames);

        return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
    }

    private loadBinaryDataToBuffer(fields: ProcessedField[]) {
        return fields.reduce((acc, curr) => {
            if (curr.type === "IntegerList") {
                acc += `${tab.repeat(4)}args.${curr.name} ? args.${curr.name} = Buffer.from(args.${curr.name}) : undefined \n`
            } return acc
        }, "")
    }

    private updateMutation(table: ProcessedTable) {
        let idColumnName;

        for (const field of table.fields) {
            if (field.primaryKey) {
                idColumnName = field.name;
            }
        }

        let mutationQuery = `${tab.repeat(2)}update${toTitleCase(
            table.displayName
        )}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
            3
        )}args: {\n`;

        let firstLoop = true;
        for (const field of table.fields) {
            if (!firstLoop) mutationQuery += ',\n';
            firstLoop = false;

            mutationQuery += `${tab.repeat(4)}${field.name}: ${this.buildMutationArgType(
                field
            )}`;
        }

        mutationQuery += `\n${tab.repeat(3)}},\n${tab.repeat(
            3
        )}resolve(parent, args) {\n`;

        mutationQuery += `${tab.repeat(
            4
        )}const { ${idColumnName}, ...rest } = args;\n`;
        mutationQuery += this.loadBinaryDataToBuffer(table.fields)
        mutationQuery += this.provider.parameterize(table.fields);

        mutationQuery += `${tab.repeat(4)}${this.provider.update(
            table.name,
            idColumnName
        )}`;

        return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
    }

    private deleteMutation(table: ProcessedTable) {
        let idColumn;

        for (const field of table.fields) {
            if (field.primaryKey) {
                idColumn = field;
            }
        }

        let mutationQuery = `${tab.repeat(2)}delete${toTitleCase(
            table.displayName
        )}: {\n${tab.repeat(3)}type: ${table.displayName}Type,\n${tab.repeat(
            3
        )}args: {\n${tab.repeat(4)}${
            idColumn.name
            }: { type: ${this.tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
                3
            )}},\n${tab.repeat(3)}resolve(parent, args) {\n`;

        mutationQuery += `${tab.repeat(4)}${this.provider.delete(
            table.name,
            idColumn.name
        )}`;

        return mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`;
    }

    addNewLine(codeSegment: 'graphqlCode' |
        'typeSchemaCode' |
        'rootQueryCode' |
        'mutationCode') {
        (<any>this)[codeSegment] += ',\n'
    }

    private createSubQueryName(relationType: string, relatedTable: string) {
        switch (relationType) {
            case 'one to one':
                return `related${toTitleCase(relatedTable)}`;

            case 'one to many':
                return `everyRelated${toTitleCase(relatedTable)}`;

            case 'many to one':
                return `related${toTitleCase(relatedTable)}`;

            default:
                return `everyRelated${toTitleCase(relatedTable)}`;
        }
    }

    private init() {
        let str = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;
        str += this.provider.connection();

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

    private tableDataTypeToGraphqlType(type: string) {
        switch (type) {
            case 'ID':
                return 'GraphQLID';
            case 'String':
                return 'GraphQLString';
            case 'Integer':
                return 'GraphQLInt';
            case 'Float':
                return 'GraphQLFloat';
            case 'Boolean':
                return 'GraphQLBoolean';
            case 'Date':
                return 'GraphQLDate';
            case 'Time':
                return 'GraphQLTime';
            case 'DateTime':
                return 'GraphQLDateTime';
            case 'IntegerList':
                return 'new GraphQLList(GraphQLInt)'
            default:
                return 'GraphQLString';
        }
    }

    private buildMutationArgType(column: ProcessedField) {
        const mutationQuery = `{ type: ${this.checkifColumnRequired(
            column.required,
            'front'
        )}${this.tableDataTypeToGraphqlType(column.type)}${this.checkifColumnRequired(
            column.required,
            'back'
        )} }`;
        return mutationQuery;
    }

    private checkifColumnRequired(required: boolean, position: string) {
        if (required) {
            if (position === 'front') {
                return 'new GraphQLNonNull(';
            }
            return ')';
        }
        return '';
    }
}


export default TypeBuilder;
