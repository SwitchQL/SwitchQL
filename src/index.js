let data = [ { table_name: 'customer',
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

function tableData(dataArr){
  let indexT = 0;
  let indexF = 0;
  let currField;
  let prevTable;

  let fieldObj = {};

  const result = {
    tables: {}
  };

  let table = {};
  let fieldInd = {};
  
  let field = {
    name: '',
    type: '',
    primaryKey: false,
    unique: false,
    relationSelected: false,
    relation: {
      tableIndex: -1,
      fieldIndex: -1,
      refType: ''
    },
    refBy: {},
    tableNum: 0,
    fieldNum: 0,
  };

  dataArr.forEach((elem, index) => {
    currField = Object.assign({}, field);
    // let { name, type, primaryKey, unique, relationSelected, relation, refBy, tableNum, fieldNum } = currField;
    let { table_name, column_name, data_type, constraint_type, foreign_table_name, foreign_column_name } = elem;

    currField.name = column_name;
    currField.type = data_type;
    if(constraint_type === 'PRIMARY KEY') currField.primaryKey = true; 
    if(constraint_type === 'UNIQUE') currField.unique = true;
    if(constraint_type === 'FOREIGN KEY'){
      currField.relationSelected = true;
      currField.relation.tableIndex = foreign_table_name;
      currField.relation.fieldIndex = foreign_column_name;
    }
    currField.tableNum = indexT;
    currField.fieldNum = indexF;

    if(prevTable !== table_name && indexF !== 0){
      result.tables[indexT] = { type: prevTable, fields: fieldObj };
      fieldObj = {};
      indexT++;
      indexF = 0;
      currField.tableNum = indexT;
      currField.fieldNum = indexF;
    }
    if(index == dataArr.length - 1){
      result.tables[indexT + 1] = { type: prevTable, fields: fieldObj };
    }
    prevTable = table_name;
    fieldObj[indexF] = currField;
    indexF++;
    
  })

  return result;
}
let r = JSON.stringify(tableData(data));
console.log(r);