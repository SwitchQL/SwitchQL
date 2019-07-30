/* eslint-disable no-return-assign */
import { toTitleCase } from '../../util';
import ProcessedTable from '../../models/processedTable';
import ProcessedField from '../../models/processedField';

const tab = `  `;

class MutationBuilder {
    private mutation = "import { gql } from 'apollo-boost';\n\n"
    private exportNames: string[] = []

    public addMutation (table: ProcessedTable): MutationBuilder {
        this.mutation += this.buildMutationSignature(table, null, 'add');
        this.mutation += this.buildTypeParams(table, null, 'add');
        this.mutation += this.buildReturnValues(table);
        this.exportNames.push(`add${toTitleCase(table.displayName)}Mutation`);

        for (const field of table.fields) {
            if (field.primaryKey) {
                this.mutation += this.buildMutationSignature(table, field, 'update');
                this.mutation += this.buildTypeParams(table, field, 'update');
                this.mutation += this.buildReturnValues(table);
                this.exportNames.push(
                    `update${toTitleCase(table.displayName)}Mutation`
                );

                this.mutation += this.buildMutationSignature(table, field, 'delete');
                this.mutation += this.buildTypeParams(table, field, 'delete');
                this.mutation += this.buildReturnValues(table);
                this.exportNames.push(
                    `delete${toTitleCase(table.displayName)}Mutation`
                );
            }
        }

        return this;
    }

    public build (): string {
        const endString = this.exportNames.reduce((acc, curr, i) => i === this.exportNames.length - 1 ?
            acc += `${tab}${curr}\n` :
            acc += `${tab}${curr},\n`, 'export {\n');

        this.mutation += `${endString}};`;
        return this.mutation;
    }

    private buildMutationSignature (table: ProcessedTable, idField: ProcessedField, mutationType: string): string {
        let mut = `const ${mutationType}${toTitleCase(
            table.displayName
        )}Mutation = gql\`\n${tab}mutation(`;

        if (mutationType === 'delete') {
            mut += `$${idField.name}: ${idField.type}!) {\n${tab}`;
            return mut;
        }

        const params = [];

        for (const field of table.fields) {
            let param = '';

            if (mutationType === 'update') {
                param += `$${field.name}: `;
                param += `${this.checkType(field.type)}`;
                param += `${this.checkRequired(field.required)}`;
            }

            if (mutationType === 'add' && !field.primaryKey) {
                param += `$${field.name}: `;
                param += `${this.checkType(field.type)}`;
                param += `${this.checkRequired(field.required)}`;
            }

            if (param) params.push(param);
        }

        mut += `${params.join(', ')}) {\n${tab}`;
        return mut;
    }

    private checkType (fieldType: string): string {
        if (fieldType === 'Number') return 'Int';
        else return fieldType;
    }

    private checkRequired (required: boolean): string {
        if (required) return '!';
        return '';
    }

    private buildTypeParams (table: ProcessedTable, idField: ProcessedField, mutationType: string): string {
        let mut = `${tab}${mutationType}${toTitleCase(table.displayName)}(`;

        if (mutationType === 'delete') {
            mut += `${idField.name}: $${idField.name}) {\n`;
            return mut;
        }

        const params = [];
        for (const field of table.fields) {
            let param = '';

            if (mutationType === 'add' && !field.primaryKey) {
                param += `${field.name}: $${field.name}`;
            }

            if (mutationType === 'update') {
                param += `${field.name}: $${field.name}`;
            }

            if (param) params.push(param);
        }

        mut += `${params.join(', ')}) {\n`;
        return mut;
    }

    private buildReturnValues (table: ProcessedTable): string {
        let mut = '';

        for (const field of table.fields) {
            mut += `${tab.repeat(3)}${field.name}\n`;
        }

        mut += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
        return mut;
    }
}


export default MutationBuilder;
