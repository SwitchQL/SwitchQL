const converter = require("../index");

const pgp = require("pg-promise")();
const mysql = require("promise-mysql");

module.exports = {
  getSchemaInfoPG: async data => {
    const url = data;
    let db = pgp(url);
    const info = await db.any(`SELECT
      t.table_name,
      c.column_name,
      c.is_nullable,
      c.data_type,
      c.character_maximum_length,
      tc.constraint_type,
      null AS foreign_table_name,
      null AS foreign_column_name
    FROM
      information_schema.tables AS t JOIN information_schema.columns AS c
        ON t.table_name = c.table_name
      LEFT JOIN information_schema.key_column_usage AS kcu
        ON t.table_name = kcu.table_name AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints AS tc
        ON kcu.constraint_name = tc.constraint_name
      LEFT JOIN information_schema.constraint_column_usage AS ccu 
        ON tc.constraint_name = ccu.constraint_name
    WHERE table_type = 'BASE TABLE'
      AND t.table_schema = 'public'
      AND (constraint_type is null OR constraint_type <> 'FOREIGN KEY')
    UNION ALL
    SELECT
      t.table_name,
      c.column_name,
      c.is_nullable,
      c.data_type,
      c.character_maximum_length,
      tc.constraint_type,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM
      information_schema.tables AS t JOIN information_schema.columns as c
        ON t.table_name = c.table_name
      LEFT JOIN information_schema.key_column_usage as kcu
        ON t.table_name = kcu.table_name AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints as tc
        ON kcu.constraint_name = tc.constraint_name
      LEFT JOIN information_schema.constraint_column_usage AS ccu
        ON tc.constraint_name = ccu.constraint_name
    WHERE table_type = 'BASE TABLE'
      AND t.table_schema = 'public'
      AND constraint_type = 'FOREIGN KEY'
    ORDER BY table_name`);
    return info;
  },
  fuseConnectionString: info => {
    let connectionString = "";
    if (info.type === "PostgreSQL") {
      connectionString += "postgres://";
    }
    connectionString += `${info.user}:${info.password}@${info.host}:${
      info.port
    }/${info.database}`;
    return connectionString;
  },
  getSchemaInfoMySQL: async info => {
    let con = await mysql.createConnection({
      host: info.host,
      user: info.user,
      password: info.password,
      database: info.database,
      port: info.port
    });
    let result = await con.query(`Select t.table_name, c.column_name,kcu.constraint_name, kcu.referenced_table_name AS foreign_table_name, kcu.referenced_column_name AS foreign_column_name, c.is_nullable, c.data_type
    from information_schema.tables t join information_schema.columns c ON t.table_name = c.table_name
    left join information_schema.key_column_usage AS kcu ON t.table_name = kcu.table_name AND c.column_name = kcu.column_name
    where t.table_schema = 'switchql' and t.table_type = 'BASE TABLE'  ORDER BY table_name;`);
    return result;
  }
};
