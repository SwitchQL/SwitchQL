const mysql = require("mysql");

// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "me",
//   password: "secret",
//   database: "my_db"
// });

//

//

const metadataQuery = `SELECT distinct
t.table_name,
c.column_name,
c.is_nullable,
c.data_type,
c.character_maximum_length,
tc.constraint_type,
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

async function getSchemaInfoPG(connString) {
  if (notRightFormat) {
    var connection = mysql.createConnection({
      host: "switchql-mysql.c9vnkgo31mgw.us-west-1.rds.amazonaws.com",
      user: "admin",
      password: "password",
      database: "my_db"
    });
  }

  connection.connect();

  try {
    return connection.query(metadataQuery, (error, results, fields) => {
      console.log("The error: " + error);
      console.log("The solution is: ", results[0].solution);
      console.log("The fields: " + fields);
      connection.end();
    });
  } catch (err) {
    throw err;
  }
}

function buildConnectionString(info) {
  let connectionString = "";
  info.port = info.port || 5432;
  connectionString += `mysql://${info.user}:${info.password}@${info.host}:${
    info.port
  }/${info.database}`;
  return connectionString;
}

module.exports = {
  getSchemaInfoPG,
  buildConnectionString
};
