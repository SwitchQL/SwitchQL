const ProcessedField = require("./classes/processedField")

function processMetadata(columnData) {
  if (!columnData || columnData.length === 0)
    throw new Error("Metadata is null or empty");

  if (!Array.isArray(columnData))
    throw new Error("Invalid data format. Column Data must be an array");

  let tblIdx = 0;
  let fieldIdx = 0;
  let prevTable = columnData[0].table_name;
  let props = {};

  let lookupFields = {};

  const lookup = {};
  const toRef = {};

  const data = {
    tables: {}
  };

  columnData.forEach((tblCol, index) => {
    // Previous table evaluation complete, format and assign to it the accumulated field data.
    if (prevTable !== tblCol.table_name) {
      data.tables[tblIdx] = { type: prevTable, fields: props };
      lookupFields["INDEX"] = tblIdx;
      lookup[prevTable] = lookupFields;

      tblIdx++;
      fieldIdx = 0;

      props = {};
      lookupFields = {};
    }

    if (index === columnData.length - 1) {
      data.tables[tblIdx] = { type: prevTable, fields: props };
    }

    const processed = new ProcessedField(tblCol, tblIdx, fieldIdx);

    if (tableInToRef(toRef, tblCol)) {
      processed.addRetroRelationship(toRef, tblCol, data);
    }

    if (tblCol.constraint_type === "FOREIGN KEY") {
      processed.addForeignKeyRef(lookup, tblCol, toRef, data);
    }

    props[fieldIdx] = processed;
    lookupFields[tblCol.column_name] = fieldIdx;

    prevTable = tblCol.table_name;
    fieldIdx++;
  });

  return data;
}

function tableInToRef(toRef, tblCol) {
  return (
    toRef.hasOwnProperty(tblCol.table_name) &&
    toRef[tblCol.table_name].hasOwnProperty(tblCol.column_name)
  );
}

module.exports = processMetadata;
