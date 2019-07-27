import IDBProvider from "./dbProvider";

const tab = `  `;

/**
 * Note: the queries are not paramaterized because the
 * mssql library automatically parameterizes all queries when
 * template literals are used.
 */
class MSSqlProvider implements IDBProvider {
	connection () {
		return "var pool\n";
	}

	selectWithWhere (table: string, col: string, val: string, returnsMany: boolean) {
		let query = `return pool.query\`SELECT * FROM [${table}] WHERE "${col}" = \${${val}}\`\n`;
		query += addPromiseResolution(returnsMany);

		return query;
	}

	select (table: string) {
		let query = `return pool.query('SELECT * FROM [${table}]')\n`;

		query += addPromiseResolution(true);

		return query;
	}

	insert (table: string, cols: string, args: string) {
		let query = `return pool.query\`INSERT INTO [${table}] (${cols}) OUTPUT INSERTED.* VALUES (${args})\`\n`;

		query += addPromiseResolution();

		return query;
	}

	update (table: string, idColumnName: string) {
		let query = `${tab.repeat(
			4
		)}req.input('${idColumnName}', ${idColumnName});\n`;

		query += `return req.query(\`UPDATE [${table}] SET \${parameterized} OUTPUT INSERTED.* WHERE "${idColumnName}" = @${idColumnName}\`)\n`;

		query += addPromiseResolution();
		return query;
	}

	delete (table: string, column: string) {
		let query = `return pool.query\`DELETE FROM [${table}] OUTPUT DELETED.* WHERE "${column}" = \${args.${column}}\`\n`;

		query += addPromiseResolution();

		return query;
	}

	parameterize () {
		let query = `${tab.repeat(4)}let updateValues = [];\n`;

		query += `${tab.repeat(4)}const req = pool.request();\n`;
		query += `${tab.repeat(4)}for (const prop in rest) {\n`;

		query += `${tab.repeat(6)}req.input(\`\${prop}\`, rest[prop]);\n`;
		query += `${tab.repeat(6)}updateValues.push(\`\${prop} = @\${prop}\`);\n`;
		query += `${tab.repeat(4)}}\n\n`;

		query += `${tab.repeat(4)}const parameterized = updateValues.join(", ");\n`;

		return query;
	}

	configureExport () {
		return `module.exports = function(connection) { 
              pool = connection;
              return new GraphQLSchema({
                query: RootQuery,
                mutation: Mutation
              });
            }`;
	}
}

const addPromiseResolution = (returnsMany = false) => {
	let str = `${tab.repeat(5)}.then(data => {\n`;
	str += `${tab.repeat(6)}return ${
		returnsMany ? "data.recordset" : "data.recordset[0]"
	};\n`;
	str += `${tab.repeat(5)}})\n`;
	str += `${tab.repeat(5)}.catch(err => {\n`;
	str += `${tab.repeat(6)}return ('The error is', err);\n`;
	str += `${tab.repeat(5)}})`;

	return str;
};

export default MSSqlProvider;
