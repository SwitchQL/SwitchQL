import ColumnTypeTranslator from '../DBMetadata/columnTypeTranslators';

/* eslint-disable no-prototype-builtins */
import { removeWhitespace } from '../util';
import DBMetadata from './dbMetadata';

class ProcessedField {
    public name: string;
    public type: string;
    public primaryKey: boolean;
    public unique: boolean;
    public required: boolean;
    public inRelationship: boolean;
    public relation: { [key: string]: any };
    public tableNum: number;
    public fieldNum: number;

    public constructor (
        col: DBMetadata,
        tblIdx: number,
        fieldIdx: number,
        translateColumnType: ColumnTypeTranslator
    ) {
        const isPrimaryKey = col.constraintType === 'PRIMARY KEY';

        this.name = removeWhitespace(col.columnName);
        this.type = isPrimaryKey ? 'ID' : translateColumnType(col.dataType);
        this.primaryKey = isPrimaryKey;
        this.unique = col.constraintType === 'UNIQUE';
        this.required = col.isNullable === 'NO';
        this.inRelationship = false;
        this.relation = {};
        this.tableNum = tblIdx;
        this.fieldNum = fieldIdx;
    }

    // Retroactive relationship assignment (foreign key table defined before primary key table)
    public addRetroRelationship (
        toRef: { [key: string]: any },
        tblCol: DBMetadata,
        data: { [key: string]: any }
    ) {
        this.inRelationship = true;
        this.type = 'ID';
        this.relation = toRef[tblCol.tableName][tblCol.columnName];

        // iterate through each relationship (one or more) and assign a relatedTo
        for (const refIndex in toRef[tblCol.tableName][tblCol.columnName]) {
            const refLookup = refIndex.split('.');
            const relatedTo = data.tables[refLookup[0]].fields[refLookup[1]];
            const relToRefIndex = `${this.tableNum}.${this.fieldNum}`;

            relatedTo.relation[relToRefIndex] = {
                refTable: this.tableNum,
                refField: this.fieldNum,
                refType: 'many to one'
            };

            relatedTo.inRelationship = true;
            relatedTo.type = 'ID';
        }
    }

    public addForeignKeyRef (
        lookup: { [key: string]: any },
        tblCol: DBMetadata,
        toRef: { [key: string]: any },
        data: { [key: string]: any }
    ) {
        this.inRelationship = true;
        this.type = 'ID';

        const ref = {
            refTable: this.tableNum,
            refField: this.fieldNum,
            refType: 'one to many'
        };

        const { foreignTableName, foreignColumnName } = tblCol;

        // Active relationship assignment (primary key table defined before foreign key table)
        if (lookup.hasOwnProperty(foreignTableName)) {
            const relationship = {
                refTable: lookup[foreignTableName].INDEX,
                refField: lookup[foreignTableName][foreignColumnName],
                refType: 'many to one'
            };

            const refIndex = `${lookup[foreignTableName].INDEX}.${
                lookup[foreignTableName][foreignColumnName]
            }`;

            (this.relation as any)[refIndex] = relationship;

            const relatedTo = data.tables[lookup[foreignTableName].INDEX].fields[lookup[foreignTableName][foreignColumnName]];
            const relToRefIndex = `${this.tableNum}.${this.fieldNum}`;

            relatedTo.relation[relToRefIndex] = ref;
            relatedTo.inRelationship = true;
            relatedTo.type = 'ID';
        } else {
            const refIndex = `${this.tableNum}.${this.fieldNum}`;
            const currRef = {
                [refIndex]: ref
            };

            if (!toRef.hasOwnProperty(tblCol.foreignTableName)) {
                toRef[tblCol.foreignTableName] = {
                    [tblCol.foreignColumnName]: currRef
                };

                return;
            }

            if (
                !toRef[tblCol.foreignTableName].hasOwnProperty(tblCol.foreignColumnName)
            ) {
                toRef[tblCol.foreignTableName][tblCol.foreignColumnName] = currRef;
                return;
            }

            toRef[tblCol.foreignTableName][tblCol.foreignColumnName][refIndex] = ref;
        }
    }
}

export default ProcessedField;
