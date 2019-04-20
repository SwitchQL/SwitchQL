import generateMutations from "./mutationGenerator";
import output from "./sampleFiles/mutationOutput";
import input from "../DBMetadata/sampleFiles/processedMetadata";

describe("Mutation Generator Tests", () => {
  it("Should correctly generate mutations given input file", () => {
    const result = generateMutations(input.tables);
    expect(result).toBe(output);
  });

  it("Should return an empty string on empty input", () => {
    const result = generateMutations({});
    expect(result).toBe("");
  });

  it("Should match the snapshot", () => {
    const result = generateMutations(input.tables);
    expect(result).toMatchSnapshot();
  });
});
