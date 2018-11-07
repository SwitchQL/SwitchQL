module.exports = {
  formatMetaData: (dataArr) => {
    let tableIndex = 0;
    let fieldIndex = 0;
    let prevTable = dataArr[0].table_name;
    let currField;
    let fields = {};
  
    let lutFields = {};
    let toRefFields = {};
    const lut = {};
    const toRef = {};
  
    const data = {
      tables: {}
    };
  
    const field = {
      name: '',
      type: '',
      primaryKey: false,
      unique: false,
      required: false,
      inRelationship: false,
      relation: {
        refTable: null,
        refField: null,
        refType: null
      },
      tableNum: 0,
      fieldNum: 0,
    };
  
    dataArr.forEach((elem, index) => {
      currField = Object.assign({}, field);
  
      // Relevant database column/field information
      let { table_name, column_name, is_nullable, data_type, constraint_type, foreign_table_name, foreign_column_name } = elem;
  
      // Previous table evaluation complete, format and assign to it the accumulated field data.
      if(prevTable !== table_name){
        data.tables[tableIndex] = { type: prevTable, fields: fields };
        fields = {};
  
        lutFields['INDEX'] = tableIndex;
        lut[prevTable] = lutFields;
        lutFields = {};
  
        // toRef[prevTable] = toRefFields;
        toRefFields = {};
  
        tableIndex++;
        fieldIndex = 0;
      }
      if(index === dataArr.length - 1){
        data.tables[tableIndex] = { type: prevTable, fields: fields };
      }
  
      // Create a field object with column data
      currField.name = column_name;
      let fieldType;
      switch(data_type){
        case 'character varying':
          fieldType = 'String';
          break;
        case 'integer':
          fieldType = 'Number';
          break;
        // Need to confirm if string 'boolean' is data_type for Booleans
        case 'boolean':
          fieldType = 'Boolean';
          break;
        case 'date':
          fieldType = 'Date';
          break;
        // Figure out appropriate default/error handling
        default:
          fieldType = null;
      }
      currField.type = fieldType;
      if(constraint_type === 'PRIMARY KEY'){
        currField.primaryKey = true;
        currField.type = 'ID';
      } 
      if(constraint_type === 'UNIQUE') currField.unique = true;
      if(is_nullable === 'NO') currField.required = true;
      // Retroactive relationship assignment (foreign key table defined before primary key table)
      if(toRef.hasOwnProperty(table_name) && toRef[table_name].hasOwnProperty(column_name)){
        currField.inRelationship = true;
        currField.type = 'ID';
        currField.relation = toRef[table_name][column_name];
        let relatedTo = data.tables[toRef[table_name][column_name].refTable].fields[toRef[table_name][column_name].refField]
        relatedTo.relation = {
          refTable: tableIndex,
          refField: fieldIndex,
          refType: 'many to one'
        }
        relatedTo.type = 'ID';
      }
      if(constraint_type === 'FOREIGN KEY'){
        currField.inRelationship = true;
        currField.type = 'ID';
        // Active relationship assignment (foreign key table defined after primary key table)
        if(lut.hasOwnProperty(foreign_table_name)){
          let relationship = {
            refTable: lut[foreign_table_name].INDEX,
            refField: lut[foreign_table_name][foreign_column_name],
            refType: 'many to one'
          }
          currField.relation = relationship;
          let relatedTo = data.tables[lut[foreign_table_name].INDEX].fields[lut[foreign_table_name][foreign_column_name]]
          relatedTo.relation = {
            refTable: tableIndex,
            refField: fieldIndex,
            refType: 'one to many'
          }
          relatedTo.inRelationship = true;
          relatedTo.type = 'ID';
        } else {
          toRefFields[foreign_column_name] = {
            refTable: tableIndex,
            refField: fieldIndex,
            refType: 'one to many'
          }
          toRef[foreign_table_name] = toRefFields;
        }
      }
      currField.tableNum = tableIndex;
      currField.fieldNum = fieldIndex;
      
      // consider ref overwrites?
      fields[fieldIndex] = currField;
      lutFields[column_name] = fieldIndex;
      // lut[prevTable] = lutFields;
      
      prevTable = table_name;
      fieldIndex++;
    })
  
    return data;
  }
}