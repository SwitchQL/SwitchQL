const initOptions = {
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    // console.log('Connected to database:', cp.database);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    // console.log('Disconnecting from database:', cp.database);
  },
  query(e) {
    // console.log('QUERY:', e.query);
  },
  receive(data, result, e) {
    // console.log('DATA: ', data);
  },
};

const pgp = require('pg-promise')(initOptions);
const mysql = require('mysql');

module.exports = {
  getSchemaInfo: async (data) => {
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
    ORDER BY table_name`,) 
    return info;
  },
  
}