module.exports = {
  formatMetaData: (dataArr) => {
    let tableIndex = 0;
    let fieldIndex = 0;
    let prevTable = dataArr[0].table_name;
    let currField;
    let fields = {};
  
    let lutFields = {};

    const lut = {};
    const toRef = {};
  
    const data = {
      tables: {}
    };
  
    
    dataArr.forEach((elem, index) => {
      currField = {
        name: '',
        type: '',
        primaryKey: false,
        unique: false,
        required: false,
        inRelationship: false,
        relation: {},
        tableNum: 0,
        fieldNum: 0,
      };
  
      // Relevant database column/field information
      let { table_name, column_name, is_nullable, data_type, constraint_type, foreign_table_name, foreign_column_name } = elem;
  
      // Previous table evaluation complete, format and assign to it the accumulated field data.
      if(prevTable !== table_name){
        data.tables[tableIndex] = { type: prevTable, fields: fields };
        fields = {};
  
        lutFields['INDEX'] = tableIndex;
        lut[prevTable] = lutFields;
        lutFields = {};
  
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
        // case 'character varying':
        //   fieldType = 'String';
        //   break;
        // case 'text':
        //   fieldType = 'String';
        //   break;
        case 'integer':
          fieldType = 'Integer';
          break;
        case 'double precision':
          fieldType = 'Float';
          break;
        case 'real':
          fieldType = 'Float';
          break;
        case 'boolean':
          fieldType = 'Boolean';
          break;
        case 'date':
          fieldType = 'Date';
          break;
        case 'time':
          fieldType = 'Time';
          break;
        case 'timestamp':
          fieldType = 'DateTime';
          break;
        default:
          fieldType = 'String';
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
        // iterate through each relationship (one or more) and assign a relatedTo
        for(let refIndex in toRef[table_name][column_name]){
          let refLookup = refIndex.split('.')
          let relatedTo = data.tables[refLookup[0]].fields[refLookup[1]];
          let relToRefIndex = tableIndex + '.' + fieldIndex;
          relatedTo.relation[relToRefIndex] = {
            refTable: tableIndex,
            refField: fieldIndex,
            refType: 'many to one'
          }
          relatedTo.inRelationship = true;
          relatedTo.type = 'ID';
        }
      }
  
  
  
      if(constraint_type === 'FOREIGN KEY'){
        let ref = {
          refTable: tableIndex,
          refField: fieldIndex,
          refType: 'one to many'
        }
        currField.inRelationship = true;
        currField.type = 'ID';
        // Active relationship assignment (foreign key table defined after primary key table)
        if(lut.hasOwnProperty(foreign_table_name)){
          let relationship = {
            refTable: lut[foreign_table_name].INDEX,
            refField: lut[foreign_table_name][foreign_column_name],
            refType: 'many to one'
          }
          let refIndex = lut[foreign_table_name].INDEX + '.' + lut[foreign_table_name][foreign_column_name];
          currField.relation[refIndex] = relationship;
          let relatedTo = data.tables[lut[foreign_table_name].INDEX].fields[lut[foreign_table_name][foreign_column_name]]
          let relToRefIndex = tableIndex + '.' + fieldIndex;
          relatedTo.relation[relToRefIndex] = ref;
          relatedTo.inRelationship = true;
          relatedTo.type = 'ID';
        } else {
          let refIndex = tableIndex + '.' + fieldIndex;
          let toRefFields = {};
          let currRef = {};
          if(!toRef.hasOwnProperty(foreign_table_name)){
            currRef[refIndex] = ref;
            toRefFields[foreign_column_name] = currRef;
            toRef[foreign_table_name] = toRefFields;
          } else {
            if(!toRef[foreign_table_name].hasOwnProperty(foreign_column_name)){
              currRef[refIndex] = ref;
              toRef[foreign_table_name][foreign_column_name] = currRef;
            } else {
              toRef[foreign_table_name][foreign_column_name][refIndex] = ref;
            }
          }
        }
      }
      currField.tableNum = tableIndex;
      currField.fieldNum = fieldIndex;
    
      fields[fieldIndex] = currField;
      lutFields[column_name] = fieldIndex;
      
      prevTable = table_name;
      fieldIndex++;
    })

    return data;
  },
} 