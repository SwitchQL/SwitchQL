const mysql = require("mysql");
const { URL } = require("url");

const metadataQuery = `SELECT distinct
t.table_name as 'table_name',
c.column_name as 'column_name',
c.is_nullable as 'is_nullable',
c.data_type as 'data_type',
c.character_maximum_length as 'character_maximum_length',
tc.constraint_type as 'constraint_type',
ccu.referenced_table_name AS foreign_table_name,
ccu.referenced_column_name AS foreign_column_name
FROM
information_schema.tables AS t JOIN information_schema.columns as c
  ON t.table_name = c.table_name
LEFT JOIN information_schema.key_column_usage as kcu
  ON t.table_name = kcu.table_name AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints as tc
  ON kcu.constraint_name = tc.constraint_name
LEFT JOIN information_schema.key_column_usage AS ccu 
  ON tc.constraint_name = ccu.constraint_name
WHERE table_type = 'BASE TABLE'
AND (constraint_type = 'FOREIGN KEY' OR (constraint_type is null OR constraint_type <> 'FOREIGN KEY'))
AND t.table_schema not in ('information_schema', 'mysql', 'performance_schema', 'phpmyadmin','sys', 'test')
ORDER BY table_name;`;

function getSchemaInfo(connString) {
  console.log("CONNECTING", connString)
  const connection = mysql.createConnection(buildMysqlParams(connString));
  
  return new Promise((resolve, reject) => {
    try {
      connection.query(metadataQuery, (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(results);
      });
    } finally {
      connection.end();
    }
  });
}

function parseUri(uri) {
  const {
    protocol = "",
    username: user,
    password,
    port,
    hostname: host,
    pathname = ""
  } = new URL(uri);
  return {
    scheme: protocol.replace(":", ""),
    user,
    password,
    host,
    port,
    database: pathname.replace("/", "")
  };
}

function buildMysqlParams(uri) {
  const { user, password, host, port, database } = parseUri(uri);
  return {
    host: host,
    user: user,
    password: password,
    database: database,
    port: Number(port)
  };
}

module.exports = {
  getSchemaInfo,
  buildMysqlParams
};
