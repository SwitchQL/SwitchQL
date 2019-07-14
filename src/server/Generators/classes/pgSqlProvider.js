const tab = `  `;

class PgSqlProvider {
	constructor (connString) {
		this.connString = connString;
	}

	connection () {
		let conn = `const pgp = require('pg-promise')();\n`;
		conn += `const connect = {};\n`;
		conn += `// WARNING - Properly secure the connection string\n`;
		conn += `connect.conn = pgp('${this.connString}');\n`;

		return conn;
	}

	selectWithWhere (table, col, val, returnsMany) {
		let query = `const sql = 'SELECT * FROM "${table}" WHERE "${col}" = $1';\n`;

		returnsMany ?
			query += `${tab.repeat(4)}return connect.conn.many(sql, ${val})\n` :
			query += `${tab.repeat(4)}return connect.conn.one(sql, ${val})\n`;

		query += addPromiseResolution();

		return query;
	}

	select (table) {
		let query = `const sql = 'SELECT * FROM "${table}"';\n`;
		query += `${tab.repeat(4)}return connect.conn.many(sql)\n`;

		query += addPromiseResolution();

		return query;
	}

	insert (table, cols, args) {
		const normalized = args
			.split(",")
			.map(a => a.replace(/[' | { | } | \$]/g, ""));

		const params = normalized.map((val, idx) => `$${idx + 1}`).join(", ");

		let query = `const sql = 'INSERT INTO "${table}" (${cols}) VALUES (${params}) RETURNING *';\n`;
		query += `${tab.repeat(4)}return connect.conn.one(sql, [${normalized.join(
			", "
		)}])\n`;

		query += addPromiseResolution();

		return query;
	}

	update (table, idColumnName) {
		let query = `const sql = \`UPDATE "${table}" SET \${parameterized} WHERE "${idColumnName}" = $1 RETURNING *\`;\n`;
		query += `${tab.repeat(
			4
		)}return connect.conn.one(sql, [${idColumnName}, ...Object.values(rest)])\n`;

		query += addPromiseResolution();
		return query;
	}

	delete (table, column) {
		let query = `const sql = 'DELETE FROM "${table}" WHERE "${column}" = $1 RETURNING *';\n`;
		query += `${tab.repeat(4)}return connect.conn.one(sql, args.${column})\n`;

		query += addPromiseResolution();

		return query;
	}

	parameterize () {
		let query = `${tab.repeat(4)}let updateValues = [];\n`;
		query += `${tab.repeat(4)}let idx = 2;\n\n`;

		query += `${tab.repeat(4)}for (const prop in rest) {\n`;

		query += `${tab.repeat(6)}updateValues.push(\`\${prop} = \$\${idx}\`);\n`;
		query += `${tab.repeat(6)}idx++;\n`;
		query += `${tab.repeat(4)}}\n`;

		query += `${tab.repeat(4)}const parameterized = updateValues.join(", ");\n`;

		return query;
	}

	configureExport () {
		return `module.exports = new GraphQLSchema({\n${tab}query: RootQuery,\n${tab}mutation: Mutation\n});`;
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

module.exports = PgSqlProvider;
