class ProcessedField {
  constructor(col, tblIdx, fieldIdx) {
    const isPrimaryKey = col.constraint_type === "PRIMARY KEY";

    this.name = col.column_name;
    this.type = isPrimaryKey ? "ID" : this.translateColumnType(col.data_type);
    this.primaryKey = isPrimaryKey;
    this.unique = col.constraint_type === "UNIQUE";
    this.required = col.is_nullable === "NO";
    this.inRelationship = false;
    this.relation = {};
    this.tableNum = tblIdx;
    this.fieldNum = fieldIdx;
  }

  translateColumnType(type) {
    switch (type) {
      case "integer":
        return "Integer";

      case "double precision":
        return "Float";

      case "real":
        return "Float";

      case "boolean":
        return "Boolean";

      case "date":
        return "Date";

      case "time":
        return "Time";

      case "timestamp":
        return "DateTime";

      default:
        return "String";
    }
  }

  // Retroactive relationship assignment (foreign key table defined before primary key table)
  addRetroRelationship(toRef, tblCol, data) {
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
        refType: "many to one"
      };

      relatedTo.inRelationship = true;
      relatedTo.type = "ID";
    }
  }

  addForeignKeyRef(lookup, tblCol, toRef, data) {
    this.inRelationship = true;
    this.type = "ID";

    const ref = {
      refTable: this.tableNum,
      refField: this.fieldNum,
      refType: "one to many"
    };

    const { foreign_table_name, foreign_column_name } = tblCol;

    // Active relationship assignment (primary key table defined before foreign key table)
    if (lookup.hasOwnProperty(foreign_table_name)) {
      const relationship = {
        refTable: lookup[foreign_table_name].INDEX,
        refField: lookup[foreign_table_name][foreign_column_name],
        refType: "many to one"
      };

      const refIndex = `${lookup[foreign_table_name].INDEX}.${
        lookup[foreign_table_name][foreign_column_name]
        }`;
      this.relation[refIndex] = relationship;

      const relatedTo =
        data.tables[lookup[foreign_table_name].INDEX].fields[
        lookup[foreign_table_name][foreign_column_name]
        ];

      const relToRefIndex = `${this.tableNum}.${this.fieldNum}`;

      relatedTo.relation[relToRefIndex] = ref;
      relatedTo.inRelationship = true;
      relatedTo.type = "ID";
    } else {
      const refIndex = `${this.tableNum}.${this.fieldNum}`;
      const currRef = {
        [refIndex]: ref
      };

      if (!toRef.hasOwnProperty(tblCol.foreign_table_name)) {
        toRef[tblCol.foreign_table_name] = {
          [tblCol.foreign_column_name]: currRef
        };

        return;
      }

      if (
        !toRef[tblCol.foreign_table_name].hasOwnProperty(
          tblCol.foreign_column_name
        )
      ) {
        toRef[tblCol.foreign_table_name][tblCol.foreign_column_name] = currRef;
        return;
      }

      toRef[tblCol.foreign_table_name][tblCol.foreign_column_name][
        refIndex
      ] = ref;
    }
  }
}

module.exports = ProcessedField;