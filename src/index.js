let primaryFirst = [ 
  { table_name: 'customer',
    column_name: 'email',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: 'UNIQUE',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'lastName',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'cid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'firstName',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'item',
    column_name: 'sku',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: 'UNIQUE',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'item',
    column_name: 'iid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'order',
    column_name: 'cid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'FOREIGN KEY',
    foreign_table_name: 'customer',
    foreign_column_name: 'cid' },
  { table_name: 'order',
    column_name: 'oid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'order',
    column_name: 'createdAt',
    is_nullable: 'NO',
    data_type: 'date',
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'shipping',
    column_name: 'method',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 55,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'shipping',
    column_name: 'sid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null } ];
let foreignFirst = [ 
  { table_name: 'item',
    column_name: 'sku',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: 'UNIQUE',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'item',
    column_name: 'iid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'order',
    column_name: 'cid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'FOREIGN KEY',
    foreign_table_name: 'customer',
    foreign_column_name: 'cid' },
  { table_name: 'order',
    column_name: 'oid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'order',
    column_name: 'createdAt',
    is_nullable: 'NO',
    data_type: 'date',
    character_maximum_length: null,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'shipping',
    column_name: 'method',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 55,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'shipping',
    column_name: 'sid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },{ table_name: 'customer',
    column_name: 'email',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: 'UNIQUE',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'lastName',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'cid',
    is_nullable: 'NO',
    data_type: 'integer',
    character_maximum_length: null,
    constraint_type: 'PRIMARY KEY',
    foreign_table_name: null,
    foreign_column_name: null },
  { table_name: 'customer',
    column_name: 'firstName',
    is_nullable: 'NO',
    data_type: 'character varying',
    character_maximum_length: 255,
    constraint_type: null,
    foreign_table_name: null,
    foreign_column_name: null } ];
let testing = [ { table_name: 'author',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'author',
column_name: 'name',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'book_order',
column_name: 'order_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'order',
foreign_column_name: 'id' },
{ table_name: 'book_order',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'book_order',
column_name: 'book_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'books',
foreign_column_name: 'id' },
{ table_name: 'books',
column_name: 'publish_date',
is_nullable: 'YES',
data_type: 'date',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'books',
column_name: 'genre_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'genre',
foreign_column_name: 'id' },
{ table_name: 'books',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'books',
column_name: 'author_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'author',
foreign_column_name: 'id' },
{ table_name: 'books',
column_name: 'name',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'genre',
column_name: 'name',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'genre',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'order',
column_name: 'shipping_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'shipping_method',
foreign_column_name: 'id' },
{ table_name: 'order',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'order',
column_name: 'user_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'user',
foreign_column_name: 'id' },
{ table_name: 'order',
column_name: 'status_id',
is_nullable: 'YES',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'FOREIGN KEY',
foreign_table_name: 'status',
foreign_column_name: 'id' },
{ table_name: 'order',
column_name: 'created_at',
is_nullable: 'YES',
data_type: 'date',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'shipping_method',
column_name: 'method',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'shipping_method',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'status',
column_name: 'code',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'status',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'user',
column_name: 'name',
is_nullable: 'NO',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'user',
column_name: 'id',
is_nullable: 'NO',
data_type: 'integer',
character_maximum_length: null,
constraint_type: 'PRIMARY KEY',
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'user',
column_name: 'address',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null },
{ table_name: 'user',
column_name: 'phone_number',
is_nullable: 'YES',
data_type: 'text',
character_maximum_length: null,
constraint_type: null,
foreign_table_name: null,
foreign_column_name: null } ]

const parseGraphqlServer = require('./parser');

// module.exports = {
//   tableData: (dataArr) => {
//     let tableIndex = 0;
//     let indexF = 0;
//     let currField;
//     let prevTable;
  
//     let fieldObj = {};
  
//     const result = {
//       tables: {}
//     };
  
//     let table = {};
//     let fieldInd = {};
    
//     let field = {
//       name: '',
//       type: '',
//       primaryKey: false,
//       unique: false,
//       relationSelected: false,
//       relation: {
//         tableIndex: -1,
//         fieldIndex: -1,
//         refType: ''
//       },
//       refBy: {},
//       tableNum: 0,
//       fieldNum: 0,
//     };
  
//     dataArr.forEach((elem, index) => {
//       currField = Object.assign({}, field);
//       // let { name, type, primaryKey, unique, relationSelected, relation, refBy, tableNum, fieldNum } = currField;
//       let { table_name, column_name, data_type, constraint_type, foreign_table_name, foreign_column_name } = elem;
  
//       currField.name = column_name;
//       currField.type = data_type;
//       if(constraint_type === 'PRIMARY KEY') currField.primaryKey = true; 
//       if(constraint_type === 'UNIQUE') currField.unique = true;
//       if(constraint_type === 'FOREIGN KEY'){
//         currField.relationSelected = true;
//         currField.relation.tableIndex = foreign_table_name;
//         currField.relation.fieldIndex = foreign_column_name;
//       }
//       currField.tableNum = indexT;
//       currField.fieldNum = indexF;
  
//       if(prevTable !== table_name && indexF !== 0){
//         result.tables[indexT] = { type: prevTable, fields: fieldObj };
//         fieldObj = {};
//         indexT++;
//         indexF = 0;
//         currField.tableNum = indexT;
//         currField.fieldNum = indexF;
//       }
//       if(index == dataArr.length - 1){
//         result.tables[indexT + 1] = { type: prevTable, fields: fieldObj };
//       }
//       prevTable = table_name;
//       fieldObj[indexF] = currField;
//       indexF++;
      
//     })
  
//     return result;
//   },
// }
function tableData(dataArr){
  let tableIndex = 0;
  let fieldIndex = 0;
  let prevTable = dataArr[0].table_name;
  let currField;
  let fields = {};

  let lutFields = {};
  // let toRefFields = {};
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
    // let currField = Object.assign({}, field);

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
      // toRefFields = {};
      

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
      case 'text':
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
      // iterate through each relationship (one or more) and assign a relatedTo
      for(let refIndex in toRef[table_name][column_name]){
        let refLookup = refIndex.split('.')
        let relatedTo = data.tables[refLookup[0]].fields[refLookup[1]];
        // let relatedTo = data.tables[toRef[table_name][column_name].refTable].fields[toRef[table_name][column_name].refField]
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
        // currField.relation = {};
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
    
    // consider ref overwrites?
    fields[fieldIndex] = currField;
    lutFields[column_name] = fieldIndex;
    // lut[prevTable] = lutFields;
    
    prevTable = table_name;
    fieldIndex++;
  })
  // console.log(lut)
  // console.log('/////////////////////////')
  // console.log(JSON.stringify(toRef))
  // console.log(field)
  return data;
}

// console.log(JSON.stringify(tableData(testing)))
// console.log(parseGraphqlServer(tableData(testing).tables, 'PostgreSQL'));
// console.log(JSON.stringify(tableData(testing)));


