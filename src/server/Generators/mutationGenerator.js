const MutationBuilder = require("./classes/mutationBuilder");

function generateMutations(tables) {
  if (Object.keys(tables).length === 0) return "";

  const builder = new MutationBuilder();

  for (const table of Object.values(tables)) {
    builder.addMutation(table);
  }

  return builder.build();
}

module.exports = generateMutations;
