/* eslint-disable no-undef */
import retriever from "../DBMetadata/msMetadataRetriever";
import DBType from '../models/dbType'

describe("msMetadataRetriever", () => {
	it("Should properly format the connection string", () => {
		const formData = {
			user: "user",
			password: "securePassword",
			port: "12345",
			host: "testing.com",
			database: "database",
			value: "",
			type: DBType.SQLServer
		};
		const connString =
      "mssql://user:securePassword@testing.com:12345/database?encrypt=true&request%20timeout=30000";

		const result = retriever.buildConnectionString(formData);

		expect(result).toBe(connString);
	});

	it("Should default the port to 1433 if no port is provided", () => {
		const formData = {
			user: "user",
			password: "securePassword",
			port: "",
			host: "testing.com",
			database: "database",
			value: "",
			type: DBType.SQLServer
		};
		const connString =
      "mssql://user:securePassword@testing.com:1433/database?encrypt=true&request%20timeout=30000";

		const result = retriever.buildConnectionString(formData);

		expect(result).toBe(connString);
	});

	it("Should throw an error on blank form data", () => {
		expect(() => {
			retriever.buildConnectionString(null);
		}).toThrowError();
	});
});
