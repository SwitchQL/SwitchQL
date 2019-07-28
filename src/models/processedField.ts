import ColumnTypeTranslator from "../server/DBMetadata/columnTypeTranslators";

/* eslint-disable no-prototype-builtins */
import { removeWhitespace } from "../server/util";

// TODO make better typings
class ProcessedField {
	name: string;
	type: string;
	primaryKey: boolean;
	unique: boolean
	required: boolean
	inRelationship: boolean
	relation: { [key: string]: any }
	tableNum: number
	fieldNum: number

	constructor (col: { [key: string]: any }, 
				 tblIdx: number, 
				 fieldIdx: number, 
				 translateColumnType: ColumnTypeTranslator) {
		const isPrimaryKey = col.constraint_type === "PRIMARY KEY";

		this.name = removeWhitespace(col.column_name);
		this.type = isPrimaryKey ? "ID" : translateColumnType(col.data_type);
		this.primaryKey = isPrimaryKey;
		this.unique = col.constraint_type === "UNIQUE";
		this.required = col.is_nullable === "NO";
		this.inRelationship = false;
		this.relation = {};
		this.tableNum = tblIdx;
		this.fieldNum = fieldIdx;
	}

	// Retroactive relationship assignment (foreign key table defined before primary key table)
	addRetroRelationship (toRef: { [key: string]: any }, 
						  tblCol: { [key: string]: any }, 
						  data:  { [key: string]: any }) {
		this.inRelationship = true;
		this.type = "ID";
		this.relation = toRef[tblCol.table_name][tblCol.column_name];

		// iterate through each relationship (one or more) and assign a relatedTo
		for (const refIndex in toRef[tblCol.table_name][tblCol.column_name]) {
			const refLookup = refIndex.split(".");
			const relatedTo = data.tables[refLookup[0]].fields[refLookup[1]];
			const relToRefIndex = `${this.tableNum}.${this.fieldNum}`;

			relatedTo.relation[relToRefIndex] = {
				refTable: this.tableNum,
				refField: this.fieldNum,
				refType: "many to one",
			};

			relatedTo.inRelationship = true;
			relatedTo.type = "ID";
		}
	}

	addForeignKeyRef (lookup: { [key: string]: any }, 
					  tblCol: { [key: string]: any }, 
					  toRef: { [key: string]: any }, 
					  data: { [key: string]: any }) {
		this.inRelationship = true;
		this.type = "ID";

		const ref = {
			refTable: this.tableNum,
			refField: this.fieldNum,
			refType: "one to many",
		};

		const { foreign_table_name, foreign_column_name } = tblCol;

		// Active relationship assignment (primary key table defined before foreign key table)
		if (lookup.hasOwnProperty(foreign_table_name)) {
			const relationship = {
				refTable: lookup[foreign_table_name].INDEX,
				refField: lookup[foreign_table_name][foreign_column_name],
				refType: "many to one",
			};

			const refIndex = `${lookup[foreign_table_name].INDEX}.${
				lookup[foreign_table_name][foreign_column_name]
			}`;
			
			(<any>this.relation)[refIndex] = relationship;

			const relatedTo =
        data.tables[lookup[foreign_table_name].INDEX].fields[lookup[foreign_table_name][foreign_column_name]
        ];

			const relToRefIndex = `${this.tableNum}.${this.fieldNum}`;

			relatedTo.relation[relToRefIndex] = ref;
			relatedTo.inRelationship = true;
			relatedTo.type = "ID";
		} else {
			const refIndex = `${this.tableNum}.${this.fieldNum}`;
			const currRef = {
				[refIndex]: ref,
			};

			if (!toRef.hasOwnProperty(tblCol.foreign_table_name)) {
				toRef[tblCol.foreign_table_name] = {
					[tblCol.foreign_column_name]: currRef,
				};

				return;
			}

			if (!toRef[tblCol.foreign_table_name].hasOwnProperty(tblCol.foreign_column_name)) {
				toRef[tblCol.foreign_table_name][tblCol.foreign_column_name] = currRef;
				return;
			}

			toRef[tblCol.foreign_table_name][tblCol.foreign_column_name][
				refIndex
			] = ref;
		}
	}
}

export default ProcessedField;
