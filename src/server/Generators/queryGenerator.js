const util = require("../util");
const tab = `  `;

function parseClientQueries(tables) {
  if (Object.keys(tables).length == 0) return "";

  let query = "import { gql } from 'apollo-boost';\n\n";
  const exportNames = [];

  // tables is state.tables from schemaReducer
  for (const table of Object.values(tables)) {
    query += buildClientQueryAll(table);
    exportNames.push(`queryEvery${util.toTitleCase(table.type)}`);

    for (let field of Object.values(table.fields)) {
      if (field.primaryKey) {
        query += buildClientQueryById(table, field);
        exportNames.push(`query${util.toTitleCase(table.type)}ById `);
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

function buildClientQueryAll(table) {
  let string = `const queryEvery${util.toTitleCase(table.type)} = gql\`\n`;
  string += `${tab}{\n`;
  string += `${tab.repeat(2)}every${util.toTitleCase(table.type)} {\n`;

  for (const fieldId in table.fields) {
    string += `${tab.repeat(3)}${table.fields[fieldId].name}\n`;
  }

  return (string += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`);
}

function buildClientQueryById(table, idField) {
  let string = `const query${util.toTitleCase(table.type)}ById = gql\`\n`;
  string += `${tab}query($${table.type}: ${idField.type}!) {\n`;
  string += `${tab.repeat(2)}${table.type}(${idField.name}: $${
    table.type
  }) {\n`;

  for (const fieldId in table.fields) {
    string += `${tab.repeat(3)}${table.fields[fieldId].name}\n`;
  }

  return (string += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`);
}

module.exports = parseClientQueries;
