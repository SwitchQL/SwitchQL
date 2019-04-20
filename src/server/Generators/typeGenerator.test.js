import generateGraphqlServer from "./typeGenerator";
import input from "../DBMetadata/sampleFiles/processedMetadata";

describe("Type generator tests", () => {
  it("Should match the snapshot", () => {
    const output = generateGraphqlServer(
      input.tables,
      "PostgreSQL",
      "postgres://test@test.com:5432/test"
    );

    expect(output).toMatchSnapshot();
  });
});
