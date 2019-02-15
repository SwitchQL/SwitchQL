const util = require("../util");
const tab = `  `;

function generateMutations(tables) {
  if (Object.keys(tables).length === 0) return "";

  let query = "import { gql } from 'apollo-boost';\n\n";
  const exportNames = [];

  for (const table of Object.values(tables)) {
    query += buildMutationSignature(table, null, "add");
    query += buildTypeParams(table, null, "add");
    query += buildReturnValues(table);
    exportNames.push(`add${util.toTitleCase(table.type)}Mutation`);

    for (let field of Object.values(table.fields)) {
      if (field.primaryKey) {
        query += buildMutationSignature(table, field, "update");
        query += buildTypeParams(table, field, "update");
        query += buildReturnValues(table);
        exportNames.push(`update${util.toTitleCase(table.type)}Mutation`);

        query += buildMutationSignature(table, field, "delete");
        query += buildTypeParams(table, field, "delete");
        query += buildReturnValues(table);
        exportNames.push(`delete${util.toTitleCase(table.type)}Mutation`);
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

  query += `${endString}};`;
  return query;
}

function buildMutationSignature(table, idField, mutationType) {
  let mut = `const ${mutationType}${util.toTitleCase(
    table.type
  )}Mutation = gql\`\n${tab}mutation(`;

  if (mutationType === "delete") {
    mut += `$${idField.name}: ${idField.type}!) {\n${tab}`;
    return mut;
  }

  const params = [];

  for (const field of Object.values(table.fields)) {
    let param = "";

    if (mutationType === "update") {
      param += `$${field.name}: `;
      param += `${checkType(field.type)}`;
      param += `${checkRequired(field.required)}`;
    }

    if (mutationType === "add" && !field.primaryKey) {
      param += `$${field.name}: `;
      param += `${checkType(field.type)}`;
      param += `${checkRequired(field.required)}`;
    }

    if (param) params.push(param);
  }

  mut += `${params.join(", ")}) {\n${tab}`;
  return mut;
}

// If the fieldType is Number it has to be converted to Int per the graphql spec
function checkType(fieldType) {
  if (fieldType === "Number") return "Int";
  else return fieldType;
}

function checkRequired(required) {
  if (required) return "!";
  return "";
}

function buildTypeParams(table, idField, mutationType) {
  let mut = `${tab}${mutationType}${util.toTitleCase(table.type)}(`;

  if (mutationType === "delete") {
    mut += `$${idField.name}: ${idField.type}) {\n`;
    return mut;
  }

  const params = [];
  for (const field of Object.values(table.fields)) {
    let param = "";

    if (mutationType === "add" && !field.primaryKey) {
      param += `${field.name}: $${field.name}`;
    }

    if (mutationType === "update") {
      param += `${field.name}: $${field.name}`;
    }

    if (param) params.push(param);
  }

  mut += `${params.join(", ")}) {\n`;
  return mut;
}

function buildReturnValues(table) {
  let mut = "";

  for (const field of Object.values(table.fields)) {
    mut += `${tab.repeat(3)}${field.name}\n`;
  }

  mut += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
  return mut;
}

module.exports = generateMutations;
