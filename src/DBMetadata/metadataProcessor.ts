/* eslint-disable no-prototype-builtins */
import ProcessedTable from '../models/processedTable';
import ColumnTypeTranslator from './columnTypeTranslators';
import ProcessedField from '../models/processedField';
import DBMetadata from '../models/dbMetadata';

function tableInToRef (
    toRef: { [key: string]: any },
    tblCol: DBMetadata
): boolean {
    return (
        toRef.hasOwnProperty(tblCol.tableName) &&
        toRef[tblCol.tableName].hasOwnProperty(tblCol.columnName)
    );
}

function processMetadata (translateColumnType: ColumnTypeTranslator) {
    return (columnData: DBMetadata[]) => {
        if (!columnData || columnData.length === 0) {
            throw new Error('Metadata is null or empty');
        }

        if (!Array.isArray(columnData)) {
            throw new Error('Invalid data format. Column Data must be an array');
        }

        let tblIdx = 0;
        let fieldIdx = 0;
        let prevTable = columnData[0].tableName;
        let props: ProcessedField[] = [];

        let lookupFields: { [key: string]: any } = {};
        const lookup: { [key: string]: any } = {};
        const toRef: { [key: string]: any } = {};

        const data: { tables: { [key: number]: ProcessedTable } } = {
            tables: {}
        };

        columnData.forEach((tblCol, index) => {
            // Previous table evaluation complete, format and assign to it the accumulated field data.
            if (prevTable !== tblCol.tableName) {
                data.tables[tblIdx] = new ProcessedTable(prevTable, props);
                lookupFields.INDEX = tblIdx;
                lookup[prevTable] = lookupFields;

                tblIdx++;
                fieldIdx = 0;

                props = [];
                lookupFields = {};
            }

            if (index === columnData.length - 1) {
                data.tables[tblIdx] = new ProcessedTable(prevTable, props);
            }

            const processed = new ProcessedField(
                tblCol,
                tblIdx,
                fieldIdx,
                translateColumnType
            );

            if (tableInToRef(toRef, tblCol)) {
                processed.addRetroRelationship(toRef, tblCol, data);
            }

            if (tblCol.constraintType === 'FOREIGN KEY') {
                processed.addForeignKeyRef(lookup, tblCol, toRef, data);
            }

            props.push(processed);
            lookupFields[tblCol.columnName] = fieldIdx;

            prevTable = tblCol.tableName;
            fieldIdx++;
        });

        return data;
    };
}

export default processMetadata;
