import generateQueries from "./queryGenerator";
import output from "./sampleFiles/queryOutput";
import input from "../DBMetadata/sampleFiles/processedMetadata";

describe("Query Generator Tests", () => {
  it("Should correctly generate queries given input file", () => {
    const result = generateQueries(input.tables);
    expect(result).toBe(output);
  });

  it("Should return an empty string on empty input", () => {
    const result = generateQueries({});
    expect(result).toBe("");
  });

  it("Should match the snapshot", () => {
    const result = generateQueries(input.tables);
    expect(result).toMatchSnapshot();
  });
});
