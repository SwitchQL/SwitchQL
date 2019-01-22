const tab = `  `;

function parseGraphqlServer(data, database, url) {
  // require graphQL
  let query = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;

  if (database === 'MySQL') {
    query += `const getConnection = require('../db/mysql_pool.js');\n`;
  }
  // ability to connect to postgres
  if (database === 'PostgreSQL') {
    query += `const pgp = require('pg-promise')();\n`;
    query += `const connect = {};\n`;
    query += `connect.conn = pgp('${url}');\n`;
  }

  query += `\nconst { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString, 
  GraphQLInt, 
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull
} = graphql;
  \n`;

  query += `const { 
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = graphql_iso_date;
  \n`;

  // BUILD TYPE SCHEMA
  // loop through all tables and build schema for each one
  for (const prop in data) {
    query += buildGraphqlTypeSchema(data[prop], data, database);
  }

  // BUILD ROOT QUERY
  query += `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`;

  let firstRootLoop = true;
  for (const prop in data) {
    if (!firstRootLoop) query += ',\n';
    firstRootLoop = false;

    query += buildGraphqlRootQuery(data[prop], database);
  }
  query += `\n${tab}}\n});\n\n`;

  // BUILD MUTATIONS
  query += `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;

  let firstMutationLoop = true;
  for (const prop in data) {
    if (!firstMutationLoop) query += ',\n';
    firstMutationLoop = false;

    query += buildGraphqlMutationQuery(data[prop], database);
  }
  query += `\n${tab}}\n});\n\n`;

  query += `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
  return query;
}

// complete = TRUE
function buildGraphqlTypeSchema(table, data, database) {
  let subQuery = '';
  // creating new graphQL object type
  let query = `const ${
    table.type
  }Type = new GraphQLObjectType({\n${tab}name: '${
    table.type
  }',\n${tab}fields: () => ({`;

  let firstLoop = true;
  // loop through all the fields in the current table
  for (let currField in table.fields) {
    if (!firstLoop) query += ',';
    firstLoop = false;
    // check the field current name and give it a graphQL type
    query += `\n${tab}${tab}${
      table.fields[currField].name
    }: { type: ${tableTypeToGraphqlType(table.fields[currField].type)} }`;

    // later try to maintain the foreign key field to be the primary value?? NO
    if (table.fields[currField].inRelationship) {
      subQuery +=
        createSubQuery(table.fields[currField], data, database) + ', ';
    }
  }
  if (subQuery !== '') query += ',';
  query += subQuery.slice(0, -2);
  return (query += `\n${tab}})\n});\n\n`);
}

// complete = TRUE
function tableTypeToGraphqlType(type) {
  switch (type) {
    case 'ID':
      return 'GraphQLID';
    case 'String':
      return 'GraphQLString';
    case 'Integer':
      return 'GraphQLInt';
    case 'Float':
      return 'GraphQLFloat';
    case 'Boolean':
      return 'GraphQLBoolean';
    case 'Date':
      return 'GraphQLDate';
    case 'Time':
      return 'GraphQLTime';
    case 'DateTime':
      return 'GraphQLDateTime';
    default:
      return 'GraphQLString';
  }
}

// complete = TRUE
function toTitleCase(refTypeName) {
  let name = refTypeName[0].toUpperCase();
  name += refTypeName.slice(1).toLowerCase();
  return name;
}

// complete = TRUE
function createSubQuery(field, data, database) {
  let query = '';
  for (let refIndex in field.relation) {
    let refLookup = refIndex.split('.');
    const refTable = data[refLookup[0]].type;
    const refFieldName = data[refLookup[0]].fields[refLookup[1]].name;
    const refFieldType = data[refLookup[0]].fields[refLookup[1]].type;

    query += `\n${tab}${tab}${createSubQueryName(
      refTable
    )}: {\n${tab}${tab}${tab}type: `;

    if (
      field.relation[refIndex].refType === 'one to many' ||
      field.relation[refIndex].refType === 'many to many'
    ) {
      query += `new GraphQLList(${refTable}Type),`;
    } else {
      query += `${refTable}Type,`;
    }
    query += `\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

    if (database === 'MongoDB') {
      query += `return ${refTable}.${findDbSearchMethod(
        refFieldName,
        refFieldType,
        field.relation.refType
      )}`;
      query += `(${createSearchObject(refFieldName, refFieldType, field)});\n`;
      query += `${tab}${tab}${tab}}\n`;
      query += `${tab}${tab}}`;
    }

    if (database === 'MySQL' || database === 'PostgreSQL') {
      if (database === 'MySQL') query += `getConnection`;
      query += `const sql = \`SELECT * FROM "${refTable}" WHERE `;

      query += `"${refFieldName}" = \${parent.${field.name}}\``;
      if (
        field.relation[refIndex].refType === 'one to many' ||
        field.relation[refIndex].refType === 'many to many'
      ) {
        query += `;\n${tab}${tab}${tab}${tab}return connect.conn.many(sql)\n`;
      } else {
        query += `;\n${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
      }
      query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
      query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
      query += `${tab}${tab}${tab}${tab}${tab}})\n`;
      query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
      query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
      query += `${tab}${tab}${tab}${tab}${tab}})\n`;
      query += `${tab}${tab}${tab}}\n`;
      query += `${tab}${tab}}`;
      //TODO: add proper amount of tabs
    }

    // complete = TRUE
    function createSubQueryName() {
      switch (field.relation[refIndex].refType) {
        case 'one to one':
          return `related${toTitleCase(refTable)}`;
        case 'one to many':
          return `everyRelated${toTitleCase(refTable)}`;
        case 'many to one':
          return `related${toTitleCase(refTable)}`;
        case 'many to many':
          return `everyRelated${toTitleCase(refTable)}`;
        default:
          return `everyRelated${toTitleCase(refTable)}`;
      }
    }
  }

  return query;
}

// complete = TRUE
function buildGraphqlRootQuery(table, database) {
  let query = '';

  query += createFindAllRootQuery(table, database);

  // primarykey id is not always the first field in our data
  for (let field in table.fields) {
    if (table.fields[field].primaryKey) {
      query += createFindByIdQuery(table, table.fields[field], database);
    }
  }

  return query;
}

// complete = TRUE
function createFindAllRootQuery(table, database) {
  let query = `${tab}${tab}every${toTitleCase(
    table.type
  )}: {\n${tab}${tab}${tab}type: new GraphQLList(${
    table.type
  }Type),\n${tab}${tab}${tab}resolve() {\n${tab}${tab}${tab}${tab}`;

  if (database === 'MongoDB') {
    query += `return ${table.type}.find({});`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    if (database === 'MySQL') query += `getConnection`;
    query += `const sql = \`SELECT * FROM "${table.type}"\``;
    query += `;\n${tab}${tab}${tab}${tab}return connect.conn.many(sql)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

// complete = TRUE
function createFindByIdQuery(table, idField, database) {
  let query = `,\n${tab}${tab}${table.type.toLowerCase()}: {\n${tab}${tab}${tab}type: ${
    table.type
  }Type,\n${tab}${tab}${tab}args: {\n${tab}${tab}${tab}${tab}${
    idField.name
  }: { type: ${tableTypeToGraphqlType(
    idField.type
  )} }\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  // args.id needs to be changed; are we even using mongo??
  if (database === 'MongoDB') {
    query += `return ${table.type}.findById(args.id);`;
  }

  if (database === 'MySQL' || database === 'PostgreSQL') {
    if (database === 'MySQL') query += `getConnection`;
    query += `const sql = \`SELECT * FROM "${table.type}" WHERE "${
      idField.name
    }" = \${args.${idField.name}}\`;\n`;
    query += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

// complete = TRUE
function buildGraphqlMutationQuery(table, database) {
  let string = ``;
  string += `${addMutation(table, database)}`;
  if (table.fields[0]) {
    string += `,\n${updateMutation(table, database)},\n`;
    string += `${deleteMutation(table, database)}`;
  }
  return string;
}

// complete = TRUE
function addMutation(table, database) {
  let query = `${tab}${tab}add${toTitleCase(
    table.type
  )}: {\n${tab}${tab}${tab}type: ${
    table.type
  }Type,\n${tab}${tab}${tab}args: {\n`;

  let fieldNames = '';
  let argNames = '';

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    // dont need the ID for adding new row because generated in SQL
    if (!table.fields[prop].primaryKey) {
      query += `${tab}${tab}${tab}${tab}${
        table.fields[prop].name
      }: ${buildMutationArgType(table.fields[prop])}`;
      fieldNames += table.fields[prop].name + ', ';
      argNames += "'${args." + table.fields[prop].name + "}', ";
    } else {
      firstLoop = true;
    }
  }

  fieldNames = fieldNames.slice(0, -2);
  argNames = argNames.slice(0, -2);
  query += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  if (database === 'MongoDB')
    query += `const ${table.type.toLowerCase()} = new ${
      table.type
    }(args);\n${tab}${tab}${tab}${tab}return ${table.type.toLowerCase()}.save();`;

  if (database === 'MySQL' || database === 'PostgreSQL') {
    if (database === 'MySQL') query += `getConnection`;
    query += `const sql = \`INSERT INTO "${
      table.type
    }" (${fieldNames}) VALUES (${argNames})\`;\n`;
    query += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);

  function buildMutationArgType(field) {
    const query = `{ type: ${checkForRequired(
      field.required,
      'front'
    )}${tableTypeToGraphqlType(field.type)}${checkForRequired(
      field.required,
      'back'
    )} }`;
    return query;
  }
}

// complete = TRUE
function updateMutation(table, database) {
  let idFieldName;
  for (let field in table.fields) {
    if (table.fields[field].primaryKey) {
      idFieldName = table.fields[field].name;
    }
  }

  let query = `${tab}${tab}update${toTitleCase(
    table.type
  )}: {\n${tab}${tab}${tab}type: ${
    table.type
  }Type,\n${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const prop in table.fields) {
    if (!firstLoop) query += ',\n';
    firstLoop = false;

    query += `${tab}${tab}${tab}${tab}${
      table.fields[prop].name
    }: ${buildMutationArgType(table.fields[prop])}`;
  }

  query += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB')
    query += `return ${table.type}.findByIdAndUpdate(args.id, args);`;

  if (database === 'MySQL' || database === 'PostgreSQL') {
    if (database === 'MySQL') query += `getConnection`;

    query += `${tab}${tab}${tab}${tab}let updateValues = '';\n`;
    query += `${tab}${tab}${tab}${tab}for (const prop in args) {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}if (prop !== "${idFieldName}") {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}updateValues += \`\${prop} = '\${args[prop]}' \`\n`;
    query += `${tab}${tab}${tab}${tab}${tab}}\n`;
    query += `${tab}${tab}${tab}${tab}}\n`;
    query += `${tab}${tab}${tab}${tab}const sql = \`UPDATE "${
      table.type
    }" SET \${updateValues} WHERE "${idFieldName}" = \${args.`;
    query += `${idFieldName}}\`;\n`;
    query += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);

  function buildMutationArgType(field) {
    const query = `{ type: ${checkForRequired(
      field.required,
      'front'
    )}${tableTypeToGraphqlType(field.type)}${checkForRequired(
      field.required,
      'back'
    )} }`;
    return query;
  }
}

// complete = TRUE
function deleteMutation(table, database) {
  let idField;
  for (let field in table.fields) {
    if (table.fields[field].primaryKey) {
      idField = table.fields[field];
    }
  }
  let query = `${tab}${tab}delete${toTitleCase(
    table.type
  )}: {\n${tab}${tab}${tab}type: ${
    table.type
  }Type,\n${tab}${tab}${tab}args: {\n${tab}${tab}${tab}${tab}${
    idField.name
  }: { type: ${tableTypeToGraphqlType(
    idField.type
  )} }\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (database === 'MongoDB')
    query += `return ${table.type}.findByIdAndRemove(args.id);`;

  if (database === 'MySQL' || database === 'PostgreSQL') {
    if (database === 'MySQL') query += `getConnection`;
    // const idFieldName = table.fields[0].name;
    query += `${tab}${tab}${tab}${tab}const sql = \`DELETE FROM "${
      table.type
    }" WHERE "${idField.name}" = \${args.`;
    query += `${idField.name}}\`;\n`;
    query += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})\n`;
    query += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    query += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    query += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (query += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

// complete = TRUE
function checkForRequired(required, position) {
  if (required) {
    if (position === 'front') {
      return 'new GraphQLNonNull(';
    }
    return ')';
  }
  return '';
}

module.exports = {
  parseGraphqlServer,
  toTitleCase,
  createFindAllRootQuery,
  buildGraphqlRootQuery,
  createSubQuery,
  buildGraphqlTypeSchema
};
