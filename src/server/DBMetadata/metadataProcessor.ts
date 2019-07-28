/* eslint-disable no-prototype-builtins */
import ProcessedTable from "../../models/processedTable"
import ColumnTypeTranslator from "./columnTypeTranslators";
import ProcessedField from "../../models/processedField";

// TODO do better typings
function processMetadata (translateColumnType: ColumnTypeTranslator) {
	return (columnData: { [key: string]: any}[]) => {
		if (!columnData || columnData.length === 0) { throw new Error("Metadata is null or empty"); }

		if (!Array.isArray(columnData)) { throw new Error("Invalid data format. Column Data must be an array"); }

		let tblIdx = 0;
		let fieldIdx = 0;
		let prevTable = columnData[0].table_name;
		let props: ProcessedField[] = [];

		let lookupFields: { [key: string]: any }  = {};

		const lookup: { [key: string]: any } = {};
		const toRef: { [key: string]: any } = {};

		const data: { tables: { [key: number]: ProcessedTable }} = {
			tables: {},
		};

		columnData.forEach((tblCol, index) => {
			// Previous table evaluation complete, format and assign to it the accumulated field data.
			if (prevTable !== tblCol.table_name) {
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

			if (tblCol.constraint_type === "FOREIGN KEY") {
				processed.addForeignKeyRef(lookup, tblCol, toRef, data);
			}

			props.push(processed);
			lookupFields[tblCol.column_name] = fieldIdx;

			prevTable = tblCol.table_name;
			fieldIdx++;
		});

		return data;
	};
}

function tableInToRef (toRef: { [key: string]: any}, tblCol: { [key: string]: any}) {
	return toRef.hasOwnProperty(tblCol.table_name) && toRef[tblCol.table_name].hasOwnProperty(tblCol.column_name);
}

export default processMetadata;
