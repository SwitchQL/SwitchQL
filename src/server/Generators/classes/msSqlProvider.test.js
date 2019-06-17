import MSSqlProvider from "./msSqlProvider";

describe("MSSqlProvider", () => {
  let provider;

  beforeAll(() => {
    provider = new MSSqlProvider();
  });

  it("Should generate code for selectWithWhere that matches the snapshot", () => {
    const result = provider.selectWithWhere(
      "testTable",
      "testCol",
      "parent.id"
    );
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for selectWithWhere", () => {
    const expected = `SELECT * FROM "testTable" WHERE "testCol" = \${parent.id}`;
    const result = provider.selectWithWhere(
      "testTable",
      "testCol",
      "parent.id"
    );

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
      "blah = ${parent.blah}, test = ${parent.test}"
    );
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for insert", () => {
    const expected = `INSERT INTO "testTable" (col1, col2) OUTPUT INSERTED.* VALUES (blah = \${parent.blah}, test = \${parent.test})`;
    const result = provider.insert(
      "testTable",
      "col1, col2",
      "blah = ${parent.blah}, test = ${parent.test}"
    );

    expect(result).toContain(expected);
  });

  it("Should generate code for update that matches the snapshot", () => {
    const result = provider.update("testTable", "idCol");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for update", () => {
    const expected = `UPDATE "testTable" SET \${parameterized} OUTPUT INSERTED.* WHERE "idCol" = @idCol`;
    const result = provider.update("testTable", "idCol");

    expect(result).toContain(expected);
  });

  it("Should generate code for delete that matches the snapshot", () => {
    const result = provider.delete("testTable", "idCol");
    expect(result).toMatchSnapshot();
  });

  it("Should generate correct sql for delete", () => {
    const expected = `DELETE FROM "testTable" WHERE "idCol" = \${args.idCol}`;
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
