const QueryBuilder = require("./classes/queryBuilder");

function generateQueries(tables) {
  if (Object.keys(tables).length == 0) return "";

  const builder = new QueryBuilder();

  for (const table of Object.values(tables)) {
    builder.addQuery(table);
  }

  return builder.build();
}

module.exports = generateQueries;
