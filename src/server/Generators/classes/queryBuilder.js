const util = require("../../util");
const tab = `  `;

class QueryBuilder {
  constructor() {
    this.query = `import { gql } from 'apollo-boost';\n\n`;
    this.exportNames = [];
  }

  addQuery(table) {
    this.query += buildAllQuery(table);
    this.exportNames.push(`queryEvery${util.toTitleCase(table.name)}`);

    for (const field of table.fields) {
      if (field.primaryKey) {
        this.query += buildQueryById(table, field);
        this.exportNames.push(`query${util.toTitleCase(table.name)}ById `);
      }
    }

    return this;
  }

  build() {
    const endString = this.exportNames.reduce((acc, curr, i) => {
      return i === this.exportNames.length - 1
        ? (acc += `${tab}${curr}\n`)
        : (acc += `${tab}${curr},\n`);
    }, "export {\n");

    this.query += `${endString}};`;
    return this.query;
  }
}

function buildAllQuery(table) {
  let string = `const queryEvery${util.toTitleCase(table.name)} = gql\`\n`;
  string += `${tab}{\n`;
  string += `${tab.repeat(2)}every${util.toTitleCase(table.name)} {\n`;

  for (const field of table.fields) {
    string += `${tab.repeat(3)}${field.name}\n`;
  }

  return (string += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`);
}

function buildQueryById(table, idField) {
  let query = `const query${util.toTitleCase(table.name)}ById = gql\`\n`;
  query += `${tab}query($${table.name}: ${idField.type}!) {\n`;
  query += `${tab.repeat(2)}${table.name}(${idField.name}: $${table.name}) {\n`;

  for (const field of table.fields) {
    query += `${tab.repeat(3)}${field.name}\n`;
  }

  query += `${tab.repeat(2)}}\n${tab}}\n\`\n\n`;
  return query;
}

module.exports = QueryBuilder;
