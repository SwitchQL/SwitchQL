const util = require("../util");

const tab = `  `;

function generateGraphqlServer(processedMetadata, dbProvider, connString) {
  let graphqlCode = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;

  graphqlCode += `const pgp = require('pg-promise')();\n`;
  graphqlCode += `const connect = {};\n`;
  graphqlCode += `// WARNING - Properly secure the connection string\n`;
  graphqlCode += `connect.conn = pgp('${connString}');\n`;

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
      processedMetadata
    );

    if (!firstLoop) rootQueryCode += ",\n";
    rootQueryCode += buildGraphqlRootCode(processedMetadata[table]);

    if (!firstLoop) mutationCode += ",\n";
    mutationCode += buildGraphqlMutationCode(processedMetadata[table]);

    firstLoop = false;
  }

  rootQueryCode += `\n${tab}}\n});\n\n`;
  mutationCode += `\n${tab}}\n});\n\n`;

  graphqlCode += typeSchemaCode + rootQueryCode + mutationCode;
  graphqlCode += `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
  return graphqlCode;
}

function buildGraphqlTypeSchema(table, processedMetadata) {
  let subQuery = "";
  // creating new graphQL object type
  let typeQuery = `const ${
    table.name
  }Type = new GraphQLObjectType({\n${tab}name: '${
    table.name
  }',\n${tab}fields: () => ({`;

  let firstLoop = true;
  // loop through all the columns in the current table
  for (const field of table.fields) {
    if (!firstLoop) typeQuery += ",";
    // check the field current name and give it a graphQL type
    typeQuery += `\n${tab.repeat(2)}${
      field.name
    }: { type: ${tableDataTypeToGraphqlType(field.type)} }`;

    // later try to maintain the foreign key field to be the primary value?? NO
    if (field.inRelationship) {
      subQuery += createSubQuery(field, processedMetadata) + ", ";
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

function createSubQuery(column, processedMetadata) {
  let subQuery = "";
  for (let relatedTableIndex in column.relation) {
    let relatedTableLookup = relatedTableIndex.split(".");
    const relatedTableName = processedMetadata[relatedTableLookup[0]].name;
    const relatedFieldName =
      processedMetadata[relatedTableLookup[0]].fields[relatedTableLookup[1]]
        .name;
    const relatedTableRelationType = column.relation[relatedTableIndex].refType;

    subQuery += `\n${tab.repeat(2)}${createSubQueryName(
      relatedTableRelationType,
      relatedTableName
    )}: {\n${tab.repeat(3)}type: `;

    if (
      relatedTableRelationType === "one to many" ||
      relatedTableRelationType === "many to many"
    ) {
      subQuery += `new GraphQLList(${relatedTableName}Type),`;
    } else {
      subQuery += `${relatedTableName}Type,`;
    }
    subQuery += `\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

    subQuery += `const sql = \`SELECT * FROM "${relatedTableName}" WHERE `;

    subQuery += `"${relatedFieldName}" = \${parent.${column.name}}\``;
    if (
      relatedTableRelationType === "one to many" ||
      relatedTableRelationType === "many to many"
    ) {
      subQuery += `;\n${tab.repeat(4)}return connect.conn.many(sql)\n`;
    } else {
      subQuery += `;\n${tab.repeat(4)}return connect.conn.one(sql)\n`;
    }
    subQuery += `${tab.repeat(5)}.then(data => {\n`;
    subQuery += `${tab.repeat(6)}return data;\n`;
    subQuery += `${tab.repeat(5)}})\n`;
    subQuery += `${tab.repeat(5)}.catch(err => {\n`;
    subQuery += `${tab.repeat(6)}return ('The error is', err);\n`;
    subQuery += `${tab.repeat(5)}})\n`;
    subQuery += `${tab.repeat(3)}}\n`;
    subQuery += `${tab.repeat(2)}}`;
  }
  return subQuery;
}

function createSubQueryName(relationType, relatedTable) {
  switch (relationType) {
    case "one to one":
      return `related${util.toTitleCase(relatedTable)}`;
    case "one to many":
      return `everyRelated${util.toTitleCase(relatedTable)}`;
    case "many to one":
      return `related${util.toTitleCase(relatedTable)}`;
    case "many to many":
      return `everyRelated${util.toTitleCase(relatedTable)}`;
    default:
      return `everyRelated${util.toTitleCase(relatedTable)}`;
  }
}

function buildGraphqlRootCode(table) {
  let rootQuery = "";

  rootQuery += createFindAllRootQuery(table);

  // primarykey id is not always the first field in our data
  for (const field of table.fields) {
    if (field.primaryKey) {
      rootQuery += createFindByIdQuery(table, field);
    }
  }

  return rootQuery;
}

function createFindAllRootQuery(table) {
  let rootQuery = `${tab.repeat(2)}every${util.toTitleCase(
    table.name
  )}: {\n${tab.repeat(3)}type: new GraphQLList(${
    table.name
  }Type),\n${tab.repeat(3)}resolve() {\n${tab.repeat(4)}`;

  rootQuery += `const sql = \`SELECT * FROM "${table.name}"\``;
  rootQuery += `;\n${tab.repeat(4)}return connect.conn.many(sql)\n`;
  rootQuery += `${tab.repeat(5)}.then(data => {\n`;
  rootQuery += `${tab.repeat(6)}return data;\n`;
  rootQuery += `${tab.repeat(5)}})\n`;
  rootQuery += `${tab.repeat(5)}.catch(err => {\n`;
  rootQuery += `${tab.repeat(6)}return ('The error is', err)\n`;
  rootQuery += `${tab.repeat(5)}})`;

  return (rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

function createFindByIdQuery(table, idColumn) {
  let rootQuery = `,\n${tab.repeat(
    2
  )}${table.name.toLowerCase()}: {\n${tab.repeat(3)}type: ${
    table.name
  }Type,\n${tab.repeat(3)}args: {\n${tab.repeat(4)}${
    idColumn.name
  }: { type: ${tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
    3
  )}},\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

  rootQuery += `const sql = \`SELECT * FROM "${table.name}" WHERE "${
    idColumn.name
  }" = \${args.${idColumn.name}}\`;\n`;

  rootQuery += `${tab.repeat(4)}return connect.conn.one(sql)\n`;
  rootQuery += `${tab.repeat(5)}.then(data => {\n`;
  rootQuery += `${tab.repeat(6)}return data;\n`;
  rootQuery += `${tab.repeat(5)}})\n`;
  rootQuery += `${tab.repeat(5)}.catch(err => {\n`;
  rootQuery += `${tab.repeat(6)}return ('The error is', err)\n`;
  rootQuery += `${tab.repeat(5)}})`;

  return (rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

function buildGraphqlMutationCode(table) {
  let mutationQuery = ``;
  mutationQuery += `${addMutation(table)}`;
  if (table.fields[0]) {
    mutationQuery += `,\n${updateMutation(table)},\n`;
    mutationQuery += `${deleteMutation(table)}`;
  }
  return mutationQuery;
}

function addMutation(table) {
  let mutationQuery = `${tab.repeat(2)}add${util.toTitleCase(
    table.name
  )}: {\n${tab.repeat(3)}type: ${table.name}Type,\n${tab.repeat(3)}args: {\n`;

  let fieldNames = "";
  let argNames = "";

  let firstLoop = true;

  for (const field of table.fields) {
    if (!firstLoop) mutationQuery += ",\n";
    firstLoop = false;

    // dont need the ID for adding new row because generated in SQL
    if (!field.primaryKey) {
      mutationQuery += `${tab.repeat(4)}${field.name}: ${buildMutationArgType(
        field
      )}`;
      fieldNames += field.name + ", ";
      argNames += "'${args." + field.name + "}', ";
    } else {
      firstLoop = true;
    }
  }

  fieldNames = fieldNames.slice(0, -2);
  argNames = argNames.slice(0, -2);
  mutationQuery += `\n${tab.repeat(3)}},\n${tab.repeat(
    3
  )}resolve(parent, args) {\n${tab.repeat(4)}`;

  mutationQuery += `const sql = \`INSERT INTO "${
    table.name
  }" (${fieldNames}) VALUES (${argNames})\`;\n`;
  mutationQuery += `${tab.repeat(4)}return connect.conn.one(sql)\n`;
  mutationQuery += `${tab.repeat(5)}.then(data => {\n`;
  mutationQuery += `${tab.repeat(6)}return data;\n`;
  mutationQuery += `${tab.repeat(5)}})\n`;
  mutationQuery += `${tab.repeat(5)}.catch(err => {\n`;
  mutationQuery += `${tab.repeat(6)}return ('The error is', err);\n`;
  mutationQuery += `${tab.repeat(5)}})`;

  return (mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

function updateMutation(table) {
  let idColumnName;

  for (const field of table.fields) {
    if (field.primaryKey) {
      idColumnName = field.name;
    }
  }

  let mutationQuery = `${tab.repeat(2)}update${util.toTitleCase(
    table.name
  )}: {\n${tab.repeat(3)}type: ${table.name}Type,\n${tab.repeat(3)}args: {\n`;

  let firstLoop = true;
  for (const field of table.fields) {
    if (!firstLoop) mutationQuery += ",\n";
    firstLoop = false;

    mutationQuery += `${tab.repeat(4)}${field.name}: ${buildMutationArgType(
      field
    )}`;
  }

  mutationQuery += `\n${tab.repeat(3)}},\n${tab.repeat(
    3
  )}resolve(parent, args) {\n`;

  mutationQuery += `${tab.repeat(4)}let updateValues = '';\n`;
  mutationQuery += `${tab.repeat(4)}for (const prop in args) {\n`;
  mutationQuery += `${tab.repeat(5)}if (prop !== "${idColumnName}") {\n`;
  mutationQuery += `${tab.repeat(
    6
  )}updateValues += \`\${prop} = '\${args[prop]}' \`\n`;

  mutationQuery += `${tab.repeat(5)}}\n`;
  mutationQuery += `${tab.repeat(4)}}\n`;
  mutationQuery += `${tab.repeat(4)}const sql = \`UPDATE "${
    table.name
  }" SET \${updateValues} WHERE "${idColumnName}" = \${args.`;

  mutationQuery += `${idColumnName}}\`;\n`;
  mutationQuery += `${tab.repeat(4)}return connect.conn.one(sql)\n`;
  mutationQuery += `${tab.repeat(5)}.then(data => {\n`;
  mutationQuery += `${tab.repeat(6)}return data;\n`;

  mutationQuery += `${tab.repeat(5)}})\n`;
  mutationQuery += `${tab.repeat(5)}.catch(err => {\n`;
  mutationQuery += `${tab.repeat(6)}return ('The error is', err);\n`;
  mutationQuery += `${tab.repeat(5)}})`;

  return (mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

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

function deleteMutation(table) {
  let idColumn;

  for (const field of table.fields) {
    if (field.primaryKey) {
      idColumn = field;
    }
  }

  let mutationQuery = `${tab.repeat(2)}delete${util.toTitleCase(
    table.name
  )}: {\n${tab.repeat(3)}type: ${table.name}Type,\n${tab.repeat(
    3
  )}args: {\n${tab.repeat(4)}${
    idColumn.name
  }: { type: ${tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
    3
  )}},\n${tab.repeat(3)}resolve(parent, args) {\n`;

  mutationQuery += `${tab.repeat(4)}const sql = \`DELETE FROM "${
    table.name
  }" WHERE "${idColumn.name}" = \${args.`;
  mutationQuery += `${idColumn.name}}\`;\n`;
  mutationQuery += `${tab.repeat(4)}return connect.conn.one(sql)\n`;
  mutationQuery += `${tab.repeat(5)}.then(data => {\n`;
  mutationQuery += `${tab.repeat(6)}return data;\n`;
  mutationQuery += `${tab.repeat(5)}})\n`;
  mutationQuery += `${tab.repeat(5)}.catch(err => {\n`;
  mutationQuery += `${tab.repeat(6)}return ('The error is', err);\n`;
  mutationQuery += `${tab.repeat(5)}})`;

  return (mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
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
