import DBProvider from './dbProvider';

const tab = `  `;

/**
 * Note: the queries are not paramaterized because the
 * mssql library automatically parameterizes all queries when
 * template literals are used.
 */
class MSSqlProvider implements DBProvider {
    public connection (): string {
        return 'var pool\n';
    }

    public selectWithWhere (table: string, col: string, val: string, returnsMany: boolean): string {
        let query = `return pool.query\`SELECT * FROM [${table}] WHERE "${col}" = \${${val}}\`\n`;
        query += this.addPromiseResolution(returnsMany);

        return query;
    }

    public select (table: string): string {
        let query = `return pool.query('SELECT * FROM [${table}]')\n`;

        query += this.addPromiseResolution(true);

        return query;
    }

    public insert (table: string, cols: string, args: string): string {
        let query = `return pool.query\`INSERT INTO [${table}] (${cols}) OUTPUT INSERTED.* VALUES (${args})\`\n`;

        query += this.addPromiseResolution();

        return query;
    }

    public update (table: string, idColumnName: string): string {
        let query = `${tab.repeat(
            4
        )}req.input('${idColumnName}', ${idColumnName});\n`;

        query += `return req.query(\`UPDATE [${table}] SET \${parameterized} OUTPUT INSERTED.* WHERE "${idColumnName}" = @${idColumnName}\`)\n`;

        query += this.addPromiseResolution();
        return query;
    }

    public delete (table: string, column: string): string {
        let query = `return pool.query\`DELETE FROM [${table}] OUTPUT DELETED.* WHERE "${column}" = \${args.${column}}\`\n`;

        query += this.addPromiseResolution();

        return query;
    }

    public parameterize (): string {
        let query = `${tab.repeat(4)}let updateValues = [];\n`;

        query += `${tab.repeat(4)}const req = pool.request();\n`;
        query += `${tab.repeat(4)}for (const prop in rest) {\n`;

        query += `${tab.repeat(6)}req.input(\`\${prop}\`, rest[prop]);\n`;
        query += `${tab.repeat(6)}updateValues.push(\`\${prop} = @\${prop}\`);\n`;
        query += `${tab.repeat(4)}}\n\n`;

        query += `${tab.repeat(4)}const parameterized = updateValues.join(", ");\n`;

        return query;
    }

    public configureExport (): string {
        return `module.exports = function(connection) { 
              pool = connection;
              return new GraphQLSchema({
                query: RootQuery,
                mutation: Mutation
              });
            }`;
    }

    private addPromiseResolution (returnsMany = false): string {
        let str = `${tab.repeat(5)}.then(data => {\n`;
        str += `${tab.repeat(6)}return ${
            returnsMany ? 'data.recordset' : 'data.recordset[0]'
        };\n`;
        str += `${tab.repeat(5)}})\n`;
        str += `${tab.repeat(5)}.catch(err => {\n`;
        str += `${tab.repeat(6)}return ('The error is', err);\n`;
        str += `${tab.repeat(5)}})`;

        return str;
    }
}

export default MSSqlProvider;
