const tab = `  `;

class PgSqlProvider {
  selectWithWhere(table, col, val, returnsMany) {
    let query = `'SELECT * FROM "${table}" WHERE "${col}" = $1';\n`;

    returnsMany
      ? (query += `${tab.repeat(4)}return connect.conn.many(sql, ${val})\n`)
      : (query += `${tab.repeat(4)}return connect.conn.one(sql, ${val})\n`);

    return query;
  }

  select(table) {
    let query = `'SELECT * FROM "${table}"';\n`;
    query += `${tab.repeat(4)}return connect.conn.many(sql)\n`;

    return query;
  }

  insert(table, cols, args) {
    const normalized = args
      .split(",")
      .map(a => a.replace(/[' | { | } | \$]/g, ""));

    const params = normalized.map((val, idx) => `$${idx + 1}`).join(", ");

    let query = `'INSERT INTO "${table}" (${cols}) VALUES (${params}) RETURNING *';\n`;
    query += `${tab.repeat(4)}return connect.conn.one(sql, [${normalized.join(
      ", "
    )}])\n`;

    return query;
  }

  update(table, idColumnName) {
    let query = `\`UPDATE "${table}" SET \${updateValues} WHERE "${idColumnName}" = \${args.${idColumnName}}\`;\n`;
    query += `${tab.repeat(4)}return connect.conn.one(sql)\n`;

    return query;
  }

  delete(table, column) {
    let query = `'DELETE FROM "${table}" WHERE "${column}" = $1';\n`;
    query += `${tab.repeat(4)}return connect.conn.one(sql, args.${column})\n`;

    return query;
  }
}

module.exports = PgSqlProvider;
