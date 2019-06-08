const pgMetadataRetriever = require("./mysqlMetadataRetriever");

test("takes in connection string returns properly formatted connection object", () => {
  expect(
    pgMetadataRetriever.buildMysqlParams(
      "mysql://root:pass@cloud.com:3306/test-db"
    )
  ).toStrictEqual({
    user: "root",
    password: "pass",
    host: "cloud.com",
    database: "test-db",
    port: 3306
  });
});
