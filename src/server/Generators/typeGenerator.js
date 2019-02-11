const tab = `  `;

function generateGraphqlServer(processedMetadata, dbProvider, connString) {
  let graphqlCode = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;

  if (dbProvider === "PostgreSQL") {
    graphqlCode += `const pgp = require('pg-promise')();\n`;
    graphqlCode += `const connect = {};\n`;
    graphqlCode += `// WARNING - Properly secure the connection string\n`;
    graphqlCode += `connect.conn = pgp('${connString}');\n`;
  }

  graphqlCode += `\nconst { 
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

  graphqlCode += `const { 
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = graphql_iso_date;
  \n`;

  let typeSchemaCode = "",
    rootQueryCode = `const RootQuery = new GraphQLObjectType({\n${tab}name: 'RootQueryType',\n${tab}fields: {\n`,
    mutationCode = `const Mutation = new GraphQLObjectType({\n${tab}name: 'Mutation',\n${tab}fields: {\n`;

  let firstLoop = true;
  for (const table in processedMetadata) {
    typeSchemaCode += buildGraphqlTypeSchema(
      processedMetadata[table],
      processedMetadata,
      dbProvider
    );

    if (!firstLoop) rootQueryCode += ",\n";
    rootQueryCode += buildGraphqlRootCode(processedMetadata[table], dbProvider);

    if (!firstLoop) mutationCode += ",\n";
    mutationCode += buildGraphqlMutationCode(
      processedMetadata[table],
      dbProvider
    );

    firstLoop = false;
  }

  rootQueryCode += `\n${tab}}\n});\n\n`;
  mutationCode += `\n${tab}}\n});\n\n`;

  graphqlCode += typeSchemaCode + rootQueryCode + mutationCode;
  graphqlCode += `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
  return graphqlCode;
}

function buildGraphqlTypeSchema(table, processedMetadata, dbProvider) {
  let subQuery = "";
  // creating new graphQL object type
  let tableName = table.type;
  let typeQuery = `const ${tableName}Type = new GraphQLObjectType({\n${tab}name: '${tableName}',\n${tab}fields: () => ({`;

  let firstLoop = true;
  let columns = table.fields;
  // loop through all the columns in the current table
  for (let column in columns) {
    if (!firstLoop) typeQuery += ",";
    // check the field current name and give it a graphQL type
    typeQuery += `\n${tab}${tab}${
      columns[column].name
    }: { type: ${tableDataTypeToGraphqlType(columns[column].type)} }`;

    // later try to maintain the foreign key field to be the primary value?? NO
    if (columns[column].inRelationship) {
      subQuery +=
        createSubQuery(columns[column], processedMetadata, dbProvider) + ", ";
    }

    firstLoop = false;
  }
  if (subQuery !== "") typeQuery += ",";
  typeQuery += subQuery.slice(0, -2);
  return (typeQuery += `\n${tab}})\n});\n\n`);
}

function tableDataTypeToGraphqlType(type) {
  switch (type) {
    case "ID":
      return "GraphQLID";
    case "String":
      return "GraphQLString";
    case "Integer":
      return "GraphQLInt";
    case "Float":
      return "GraphQLFloat";
    case "Boolean":
      return "GraphQLBoolean";
    case "Date":
      return "GraphQLDate";
    case "Time":
      return "GraphQLTime";
    case "DateTime":
      return "GraphQLDateTime";
    default:
      return "GraphQLString";
  }
}

function createSubQuery(column, processedMetadata, dbProvider) {
  let subQuery = "";
  for (let relatedTableIndex in column.relation) {
    let relatedTableLookup = relatedTableIndex.split(".");
    const relatedTableName = processedMetadata[relatedTableLookup[0]].type;
    const relatedFieldName =
      processedMetadata[relatedTableLookup[0]].fields[relatedTableLookup[1]]
        .name;
    const relatedTableRelationType = column.relation[relatedTableIndex].refType;

    subQuery += `\n${tab}${tab}${createSubQueryName(
      relatedTableRelationType,
      relatedTableName
    )}: {\n${tab}${tab}${tab}type: `;

    if (
      relatedTableRelationType === "one to many" ||
      relatedTableRelationType === "many to many"
    ) {
      subQuery += `new GraphQLList(${relatedTableName}Type),`;
    } else {
      subQuery += `${relatedTableName}Type,`;
    }
    subQuery += `\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

    if (dbProvider === "PostgreSQL") {
      subQuery += `const sql = \`SELECT * FROM "${relatedTableName}" WHERE `;

      subQuery += `"${relatedFieldName}" = \${parent.${column.name}}\``;
      if (
        relatedTableRelationType === "one to many" ||
        relatedTableRelationType === "many to many"
      ) {
        subQuery += `;\n${tab}${tab}${tab}${tab}return connect.conn.many(sql)\n`;
      } else {
        subQuery += `;\n${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
      }
      subQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
      subQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
      subQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
      subQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
      subQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
      subQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
      subQuery += `${tab}${tab}${tab}}\n`;
      subQuery += `${tab}${tab}}`;
    }
  }
  return subQuery;
}

function createSubQueryName(relationType, relatedTable) {
  switch (relationType) {
    case "one to one":
      return `related${formatTypeName(relatedTable)}`;
    case "one to many":
      return `everyRelated${formatTypeName(relatedTable)}`;
    case "many to one":
      return `related${formatTypeName(relatedTable)}`;
    case "many to many":
      return `everyRelated${formatTypeName(relatedTable)}`;
    default:
      return `everyRelated${formatTypeName(relatedTable)}`;
  }
}

function formatTypeName(relatedTableName) {
  let name = relatedTableName[0].toUpperCase();
  name += relatedTableName.slice(1).toLowerCase();
  return name;
}

function buildGraphqlRootCode(table, dbProvider) {
  let rootQuery = "";

  rootQuery += createFindAllRootQuery(table, dbProvider);

  // primarykey id is not always the first field in our data
  let columns = table.fields;
  for (const column in columns) {
    if (columns[column].primaryKey) {
      rootQuery += createFindByIdQuery(table, columns[column], dbProvider);
    }
  }

  return rootQuery;
}

function createFindAllRootQuery(table, dbProvider) {
  let tableName = table.type;
  let rootQuery = `${tab}${tab}every${formatTypeName(
    tableName
  )}: {\n${tab}${tab}${tab}type: new GraphQLList(${tableName}Type),\n${tab}${tab}${tab}resolve() {\n${tab}${tab}${tab}${tab}`;

  if (dbProvider === "PostgreSQL") {
    rootQuery += `const sql = \`SELECT * FROM "${tableName}"\``;
    rootQuery += `;\n${tab}${tab}${tab}${tab}return connect.conn.many(sql)\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err)\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (rootQuery += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

function createFindByIdQuery(table, idColumn, dbProvider) {
  let tableName = table.type;
  let rootQuery = `,\n${tab}${tab}${tableName.toLowerCase()}: {\n${tab}${tab}${tab}type: ${tableName}Type,\n${tab}${tab}${tab}args: {\n${tab}${tab}${tab}${tab}${
    idColumn.name
  }: { type: ${tableDataTypeToGraphqlType(
    idColumn.type
  )} }\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  if (dbProvider === "PostgreSQL") {
    rootQuery += `const sql = \`SELECT * FROM "${tableName}" WHERE "${
      idColumn.name
    }" = \${args.${idColumn.name}}\`;\n`;
    rootQuery += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err)\n`;
    rootQuery += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (rootQuery += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

function buildGraphqlMutationCode(table, dbProvider) {
  let mutationQuery = ``;
  mutationQuery += `${addMutation(table, dbProvider)}`;
  if (table.fields[0]) {
    mutationQuery += `,\n${updateMutation(table, dbProvider)},\n`;
    mutationQuery += `${deleteMutation(table, dbProvider)}`;
  }
  return mutationQuery;
}

function addMutation(table, dbProvider) {
  let tableName = table.type;
  let mutationQuery = `${tab}${tab}add${formatTypeName(
    tableName
  )}: {\n${tab}${tab}${tab}type: ${tableName}Type,\n${tab}${tab}${tab}args: {\n`;

  let fieldNames = "";
  let argNames = "";

  let firstLoop = true;
  let columns = table.fields;
  for (const column in columns) {
    if (!firstLoop) mutationQuery += ",\n";
    firstLoop = false;

    // dont need the ID for adding new row because generated in SQL
    if (!columns[column].primaryKey) {
      mutationQuery += `${tab}${tab}${tab}${tab}${
        columns[column].name
      }: ${buildMutationArgType(columns[column])}`;
      fieldNames += columns[column].name + ", ";
      argNames += "'${args." + columns[column].name + "}', ";
    } else {
      firstLoop = true;
    }
  }

  fieldNames = fieldNames.slice(0, -2);
  argNames = argNames.slice(0, -2);
  mutationQuery += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n${tab}${tab}${tab}${tab}`;

  if (dbProvider === "PostgreSQL") {
    mutationQuery += `const sql = \`INSERT INTO "${tableName}" (${fieldNames}) VALUES (${argNames})\`;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (mutationQuery += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);

  function buildMutationArgType(column) {
    const mutationQuery = `{ type: ${checkifColumnRequired(
      column.required,
      "front"
    )}${tableDataTypeToGraphqlType(column.type)}${checkifColumnRequired(
      column.required,
      "back"
    )} }`;
    return mutationQuery;
  }
}

function updateMutation(table, dbProvider) {
  let tableName = table.type;
  let idColumnName;
  let columns = table.fields;
  for (let column in columns) {
    if (columns[column].primaryKey) {
      idColumnName = columns[column].name;
    }
  }

  let mutationQuery = `${tab}${tab}update${formatTypeName(
    tableName
  )}: {\n${tab}${tab}${tab}type: ${tableName}Type,\n${tab}${tab}${tab}args: {\n`;

  let firstLoop = true;
  for (const column in columns) {
    if (!firstLoop) mutationQuery += ",\n";
    firstLoop = false;

    mutationQuery += `${tab}${tab}${tab}${tab}${
      columns[column].name
    }: ${buildMutationArgType(columns[column])}`;
  }

  mutationQuery += `\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (dbProvider === "PostgreSQL") {
    mutationQuery += `${tab}${tab}${tab}${tab}let updateValues = '';\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}for (const prop in args) {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}if (prop !== "${idColumnName}") {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}updateValues += \`\${prop} = '\${args[prop]}' \`\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}}\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}}\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}const sql = \`UPDATE "${tableName}" SET \${updateValues} WHERE "${idColumnName}" = \${args.`;
    mutationQuery += `${idColumnName}}\`;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (mutationQuery += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);

  function buildMutationArgType(column) {
    const mutationQuery = `{ type: ${checkifColumnRequired(
      column.required,
      "front"
    )}${tableDataTypeToGraphqlType(column.type)}${checkifColumnRequired(
      column.required,
      "back"
    )} }`;
    return mutationQuery;
  }
}

function deleteMutation(table, dbProvider) {
  let tableName = table.type;
  let idColumn;
  let columns = table.fields;
  for (let column in columns) {
    if (table.fields[column].primaryKey) {
      idColumn = table.fields[column];
    }
  }
  let mutationQuery = `${tab}${tab}delete${formatTypeName(
    tableName
  )}: {\n${tab}${tab}${tab}type: ${tableName}Type,\n${tab}${tab}${tab}args: {\n${tab}${tab}${tab}${tab}${
    idColumn.name
  }: { type: ${tableDataTypeToGraphqlType(
    idColumn.type
  )} }\n${tab}${tab}${tab}},\n${tab}${tab}${tab}resolve(parent, args) {\n`;

  if (dbProvider === "PostgreSQL") {
    mutationQuery += `${tab}${tab}${tab}${tab}const sql = \`DELETE FROM "${tableName}" WHERE "${
      idColumn.name
    }" = \${args.`;
    mutationQuery += `${idColumn.name}}\`;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}return connect.conn.one(sql)\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.then(data => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return data;\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}.catch(err => {\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}${tab}return ('The error is', err);\n`;
    mutationQuery += `${tab}${tab}${tab}${tab}${tab}})`;
  }

  return (mutationQuery += `\n${tab}${tab}${tab}}\n${tab}${tab}}`);
}

function checkifColumnRequired(required, position) {
  if (required) {
    if (position === "front") {
      return "new GraphQLNonNull(";
    }
    return ")";
  }
  return "";
}

module.exports = generateGraphqlServer;
