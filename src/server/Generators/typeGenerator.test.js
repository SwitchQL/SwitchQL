import generateGraphqlServer from "./typeGenerator";
import input from "../DBMetadata/sampleFiles/processedMetadata";
import PgSqlProvider from "./classes/pgSqlProvider";

describe("Type generator tests", () => {
  it("Should match the snapshot", () => {
    const output = generateGraphqlServer(
      input.tables,
      new PgSqlProvider(),
      "postgres://test@test.com:5432/test"
    );

    expect(output).toMatchSnapshot();
  });
});
