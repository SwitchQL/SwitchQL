const TypeBuilder = require("./classes/typeBuilder");

function generateGraphqlServer(processedMetadata, dbProvider, connString) {
  const typeBuilder = new TypeBuilder(dbProvider, connString);

  let firstLoop = true;
  for (const table in processedMetadata) {
    typeBuilder.addGraphqlTypeSchema(
      processedMetadata[table],
      processedMetadata
    );

    if (!firstLoop) typeBuilder.addNewLine("rootQueryCode");
    typeBuilder.addGraphqlRootCode(processedMetadata[table]);

    if (!firstLoop) typeBuilder.addNewLine("mutationCode");
    typeBuilder.addGraphqlMutationCode(processedMetadata[table]);

    firstLoop = false;
  }

  return typeBuilder.build();
}

module.exports = generateGraphqlServer;
