const util = require("../util");

const tab = `  `;

function generateGraphqlServer(processedMetadata, dbProvider, connString) {
  let graphqlCode = `const graphql = require('graphql');\nconst graphql_iso_date = require('graphql-iso-date');\n`;

  graphqlCode += dbProvider.connection(connString);

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
      subQuery += createSubQuery(field, processedMetadata, dbProvider) + ", ";
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
    const relatedTableName = processedMetadata[relatedTableLookup[0]].name;
    const relatedFieldName =
      processedMetadata[relatedTableLookup[0]].fields[relatedTableLookup[1]]
        .name;
    const relatedTableRelationType = column.relation[relatedTableIndex].refType;

    subQuery += `\n${tab.repeat(2)}${createSubQueryName(
      relatedTableRelationType,
      relatedTableName
    )}: {\n${tab.repeat(3)}type: `;

    if (relatedTableRelationType === "one to many") {
      subQuery += `new GraphQLList(${relatedTableName}Type),`;
    } else {
      subQuery += `${relatedTableName}Type,`;
    }
    subQuery += `\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

    subQuery += `const sql = ${dbProvider.selectWithWhere(
      relatedTableName,
      relatedFieldName,
      `parent.${column.name}`,
      relatedTableRelationType === "one to many"
    )}`;

    subQuery += "\n";
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

    default:
      return `everyRelated${util.toTitleCase(relatedTable)}`;
  }
}

function buildGraphqlRootCode(table, dbProvider) {
  let rootQuery = "";

  rootQuery += createFindAllRootQuery(table, dbProvider);

  // primarykey id is not always the first field in our data
  for (const field of table.fields) {
    if (field.primaryKey) {
      rootQuery += createFindByIdQuery(table, field, dbProvider);
    }
  }

  return rootQuery;
}

function createFindAllRootQuery(table, dbProvider) {
  let rootQuery = `${tab.repeat(2)}every${util.toTitleCase(
    table.name
  )}: {\n${tab.repeat(3)}type: new GraphQLList(${
    table.name
  }Type),\n${tab.repeat(3)}resolve() {\n${tab.repeat(4)}`;

  rootQuery += `const sql = ${dbProvider.select(table.name)}`;

  return (rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

function createFindByIdQuery(table, idColumn, dbProvider) {
  let rootQuery = `,\n${tab.repeat(
    2
  )}${table.name.toLowerCase()}: {\n${tab.repeat(3)}type: ${
    table.name
  }Type,\n${tab.repeat(3)}args: {\n${tab.repeat(4)}${
    idColumn.name
  }: { type: ${tableDataTypeToGraphqlType(idColumn.type)} }\n${tab.repeat(
    3
  )}},\n${tab.repeat(3)}resolve(parent, args) {\n${tab.repeat(4)}`;

  rootQuery += `const sql = ${dbProvider.selectWithWhere(
    table.name,
    idColumn.name,
    `args.${idColumn.name}`,
    false
  )}`;

  return (rootQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
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

  mutationQuery += `const sql = ${dbProvider.insert(
    table.name,
    fieldNames,
    argNames
  )}`;

  return (mutationQuery += `\n${tab.repeat(3)}}\n${tab.repeat(2)}}`);
}

function updateMutation(table, dbProvider) {
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
  mutationQuery += `${tab.repeat(4)}let idx = 2;\n\n`;

  mutationQuery += `${tab.repeat(4)}for (const prop in args) {\n`;
  mutationQuery += `${tab.repeat(5)}if (prop !== "${idColumnName}") {\n`;
  mutationQuery += `${tab.repeat(
    6
  )}updateValues += \`\${prop} = '\$\${idx}' \`\n`;
  mutationQuery += `${tab.repeat(6)}idx++;\n`;

  mutationQuery += `${tab.repeat(5)}}\n`;
  mutationQuery += `${tab.repeat(4)}}\n`;

  mutationQuery += `${tab.repeat(4)}const sql = ${dbProvider.update(
    table.name,
    idColumnName
  )}`;

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

function deleteMutation(table, dbProvider) {
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

  mutationQuery += `${tab.repeat(4)}const sql = ${dbProvider.delete(
    table.name,
    idColumn.name
  )}`;

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
