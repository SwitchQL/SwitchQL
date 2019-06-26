const mysqlMetadataRetriever = require('../../DBMetadata/mysql/mysqlMetadataRetriever')

const tab = `  `;

class MySqlProvider {
  constructor(connString) {
    this.connString = connString;
  }

  connection() {
    let conn = `const connection = require("mysql-promise");\n`;
    conn += `// WARNING - Properly secure the connection string\n`;
    conn += `connection.configure(${JSON.stringify(mysqlMetadataRetriever.buildMysqlParams(
      this.connString
    ))});\n`;

    return conn;
  }

  selectWithWhere(table, col, val, returnsMany) {
    let query = `'SELECT * FROM ${table} WHERE ${col} = ?;';\n`;

    returnsMany
      ? (query += `${tab.repeat(4)}return connection.query(sql, ${val})\n`)
      : (query += `${tab.repeat(4)}return connection.query(sql, ${val})\n`);

    query += addPromiseResolution(returnsMany);

    return query;
  }

  select(table) {
    let query = `'SELECT * FROM ${table};';\n`;
    query += `${tab.repeat(4)}return connection.query(sql)\n`;

    query += addPromiseResolution();

    return query;
  }

  insert(table, cols, args) {
    const normalized = args
      .split(",")
      .map(a => a.replace(/[' | { | } | \$]/g, ""));

    const params = normalized.map((val, idx) => `$${idx + 1}`).join(", ");

    let query = `'INSERT INTO ${table} (${cols}) VALUES (${params}) RETURNING *;';\n`;
    query += `${tab.repeat(4)}return connection.query(sql, [${normalized.join(
      ", "
    )}])\n`;

    query += addPromiseResolution();

    return query;
  }

  update(table, idColumnName) {
    let query = `\`UPDATE ${table} SET \${updateValues} WHERE ${idColumnName} = ? RETURNING *\`;\n`;
    query += `${tab.repeat(
      4
    )}return connection.query(sql, [id, ...Object.values(rest)])\n`;

    query += addPromiseResolution();
    return query;
  }

  delete(table, column) {
    let query = `'DELETE FROM ${table} WHERE ${column} = ?;';\n`;
    query += `${tab.repeat(4)}return connection.query(sql, args.${column})\n`;

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
              return new GraphQLSchema({
                query: RootQuery,
                mutation: Mutation
              });
            }`;
  }
}

const addPromiseResolution = (returnsMany=true) => {
  let str = `${tab.repeat(5)}.then(data => {\n`;
  returnsMany 
    ?  str += `${tab.repeat(6)}return data[0];\n`
    :  str += `${tab.repeat(6)}return data[0][0];\n`;
  str += `${tab.repeat(5)}})\n`;
  str += `${tab.repeat(5)}.catch(err => {\n`;
  str += `${tab.repeat(6)}console.log(err);\n`;
  str += `${tab.repeat(6)}return ('The error is', err);\n`;
  str += `${tab.repeat(5)}})`;

  return str;
};

module.exports = MySqlProvider;
