import MSSqlProvider from "./msSqlProvider";

describe("MSSqlProvider", () => {
  let provider;

  beforeAll(() => {
    provider = new MSSqlProvider();
  });

  it("Should generate code for selectWithWhere that matches the snapshot", () => {
    const result = provider.selectWithWhere("testTable", "testCol", "12345");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for selectWithWhere", () => {
    const expected = `'SELECT * FROM "testTable" WHERE "testCol" = 12345'`;
    const result = provider.selectWithWhere("testTable", "testCol", "12345");

    expect(result).toContain(expected);
  });

  it("Should generate code for select that matches the snapshot", () => {
    const result = provider.select("testTable");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for select", () => {
    const expected = `'SELECT * FROM "testTable"'`;
    const result = provider.select("testTable");

    expect(result).toContain(expected);
  });

  it("Should generate code for insert that matches the snapshot", () => {
    const result = provider.insert(
      "testTable",
      "testCol",
      "blah = 5, test = 6"
    );
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for insert", () => {
    const expected = `\`INSERT INTO "testTable" (col1, col2) VALUES (arg1 = test1, arg2 = test2) OUTPUT INSERTED.*\`;`;
    const result = provider.insert(
      "testTable",
      "col1, col2",
      "arg1 = test1, arg2 = test2"
    );

    expect(result).toContain(expected);
  });

  it("Should generate code for update that matches the snapshot", () => {
    const result = provider.update("testTable", "idCol");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for update", () => {
    const expected = `\`UPDATE "testTable" SET \${updateValues} WHERE "idCol" = \${id} OUTPUT UPDATED.*\`;`;
    const result = provider.update("testTable", "idCol");

    expect(result).toContain(expected);
  });

  it("Should generate code for delete that matches the snapshot", () => {
    const result = provider.delete("testTable", "idCol");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for delete", () => {
    const expected = `'DELETE FROM "testTable" WHERE "idCol" = args.idCol';`;
    const result = provider.delete("testTable", "idCol");

    expect(result).toContain(expected);
  });

  it("Should generate code for paramaterize that matches the snapshot", () => {
    const result = provider.parameterize();
    expect(result).toMatchSnapshot();
  });

  it("Should generate code for configureExport that matches the snapshot", () => {
    const result = provider.configureExport();
    expect(result).toMatchSnapshot();
  });
});
