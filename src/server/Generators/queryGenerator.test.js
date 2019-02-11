import parseClientQueries from "./clientQueryGenerator";
import output from "./sampleFiles/queryOutput";
import input from "../DBMetadata/sampleFiles/processedMetadata";

describe("Client Query Generator Tests", () => {
  it("Should correctly generate client queries given input file", () => {
    const result = parseClientQueries(input.tables);
    expect(result).toBe(output);
  });

  it("Should return an empty string on empty input", () => {
    const result = parseClientQueries({});
    expect(result).toBe("");
  });
});
