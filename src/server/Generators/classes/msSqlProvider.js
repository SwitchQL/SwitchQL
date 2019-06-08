const tab = `  `;

/**
 * Note: the queries are not paramaterized because the
 * mssql library automatically parameterizes all queries when
 * template literals are used.
 */
class MSSqlProvider {
  connection() {
    return "var pool\n";
  }

  selectWithWhere(table, col, val, /* Not Used */ returnsMany) {
    let query = `'SELECT * FROM "${table}" WHERE "${col}" = ${val}'\n`;

    query += `${tab.repeat(4)}return pool.query\`\${sql}\`\n`;
    query += addPromiseResolution();

    return query;
  }

  select(table) {
    let query = `'SELECT * FROM "${table}"';\n`;
    query += `${tab.repeat(4)}return pool.query\`\${sql}\`\n`;

    query += addPromiseResolution();

    return query;
  }

  insert(table, cols, args) {
    let query = `\`INSERT INTO "${table}" (${cols}) VALUES (${args}) OUTPUT INSERTED.*\`;\n`;
    query += `${tab.repeat(4)}return pool.query\`\${sql}\`\n`;

    query += addPromiseResolution();

    return query;
  }

  update(table, idColumnName) {
    let query = `\`UPDATE "${table}" SET \${updateValues} WHERE "${idColumnName}" = \${id} OUTPUT UPDATED.*\`;\n`;
    query += `${tab.repeat(4)}return pool.query\`\${sql}\`\n`;

    query += addPromiseResolution();
    return query;
  }

  delete(table, column) {
    let query = `'DELETE FROM "${table}" WHERE "${column}" = args.${column}';\n`;
    query += `${tab.repeat(4)}return pool.query\`\${sql}\`\n`;

    query += addPromiseResolution();

    return query;
  }

  parameterize() {
    let query = `${tab.repeat(4)}for (const prop in rest) {\n`;

    query += `${tab.repeat(6)}updateValues += \`\${prop} = \${rest[prop]} \`\n`;
    query += `${tab.repeat(4)}}\n`;

    return query;
  }

  configureExport() {
    return `module.exports = function(connection) { 
              pool = connection;
              return new GraphQLSchema({
                query: RootQuery,
                mutation: Mutation
              });
            }`;
  }
}

const addPromiseResolution = () => {
  let str = `${tab.repeat(5)}.then(data => {\n`;
  str += `${tab.repeat(6)}return data;\n`;
  str += `${tab.repeat(5)}})\n`;
  str += `${tab.repeat(5)}.catch(err => {\n`;
  str += `${tab.repeat(6)}return ('The error is', err);\n`;
  str += `${tab.repeat(5)}})`;

  return str;
};

module.exports = MSSqlProvider;
