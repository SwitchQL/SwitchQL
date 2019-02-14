const util = require("../util");

const tab = `  `;

function parseClientMutations(tables) {
  let query = "import { gql } from 'apollo-boost';\n\n";
  const exportNames = [];

  // Build mutations
  for (const tableId in tables) {
    // Build add mutations
    query += buildMutationParams(tables[tableId], null, "add");
    query += buildTypeParams(tables[tableId], null, "add");
    query += buildReturnValues(tables[tableId]);
    exportNames.push(`add${util.toTitleCase(tables[tableId].type)}Mutation`);

    // check if table has an ID field
    for (let fieldId in tables[tableId].fields) {
      if (tables[tableId].fields[fieldId].primaryKey) {
        // update mutations
        query += buildMutationParams(
          tables[tableId],
          tables[tableId].fields[fieldId],
          "update"
        );
        query += buildTypeParams(
          tables[tableId],
          tables[tableId].fields[fieldId],
          "update"
        );
        query += buildReturnValues(tables[tableId]);
        exportNames.push(
          `update${util.toTitleCase(tables[tableId].type)}Mutation`
        );
        // delete mutations
        query += buildMutationParams(
          tables[tableId],
          tables[tableId].fields[fieldId],
          "delete"
        );
        query += buildTypeParams(
          tables[tableId],
          tables[tableId].fields[fieldId],
          "delete"
        );
        query += buildReturnValues(tables[tableId]);
        exportNames.push(
          `delete${util.toTitleCase(tables[tableId].type)}Mutation`
        );
      }
    }
  }

  let endString = `export {\n`;
  exportNames.forEach((name, i) => {
    if (i !== exportNames.length - 1) {
      endString += `${tab}${name},\n`;
    } else {
      endString += `${tab}${name}\n`;
    }
  });

  return (query += `${endString}};`);
}

// builds params for either add or update mutations
function buildMutationParams(table, idField, mutationType) {
  let query = `const ${mutationType}${util.toTitleCase(
    table.type
  )}Mutation = gql\`\n${tab}mutation(`;

  if (mutationType === "delete") {
    query += `$${idField.name}: ${idField.type}!`;
  } else {
    let firstLoop = true;
    for (const fieldId in table.fields) {
      // if there's an unique id and creating an update mutation, then take in ID
      if (mutationType === "update") {
        if (!firstLoop) query += ", ";
        firstLoop = false;

        query += `$${table.fields[fieldId].name}: `;
        query += `${checkFieldType(table.fields[fieldId].type)}`;
        query += `${checkForRequired(table.fields[fieldId].required)}`;
      }
      if (mutationType === "add" && !table.fields[fieldId].primaryKey) {
        if (!firstLoop) query += ", ";
        firstLoop = false;

        query += `$${table.fields[fieldId].name}: `;
        query += `${checkFieldType(table.fields[fieldId].type)}`;
        query += `${checkForRequired(table.fields[fieldId].required)}`;
      }
    }
  }
  return (query += `) {\n${tab}`);
}

// in case the inputed field type is Number, turn to Int to work with GraphQL
function checkFieldType(fieldType) {
  if (fieldType === "Number") return "Int";
  else return fieldType;
}

function checkForRequired(required) {
  if (required) {
    return "!";
  }
  return "";
}

function buildTypeParams(table, idField, mutationType) {
  let query = `${tab}${mutationType}${util.toTitleCase(table.type)}(`;
  if (mutationType === "delete") {
    query += `$${idField.name}: ${idField.type}`;
  } else {
    let firstLoop = true;
    for (const fieldId in table.fields) {
      if (mutationType === "add" && !table.fields[fieldId].primaryKey) {
        if (!firstLoop) query += ", ";
        firstLoop = false;

        query += `${table.fields[fieldId].name}: $${
          table.fields[fieldId].name
        }`;
      }
      if (mutationType === "update") {
        if (!firstLoop) query += ", ";
        firstLoop = false;

        query += `${table.fields[fieldId].name}: $${
          table.fields[fieldId].name
        }`;
      }
    }
  }
  return (query += `) {\n`);
}

function buildReturnValues(table) {
  let query = "";

  for (const fieldId in table.fields) {
    query += `${tab}${tab}${tab}${table.fields[fieldId].name}\n`;
  }

  return (query += `${tab}${tab}}\n${tab}}\n\`\n\n`);
}

module.exports = parseClientMutations;
