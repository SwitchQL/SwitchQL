/* eslint-disable no-undef */
import { buildConnectionString } from "./msMetadataRetriever";

describe("msMetadataRetriever", () => {
	it("Should properly format the connection string", () => {
		const formData = {
			user: "user",
			password: "securePassword",
			port: 12345,
			host: "testing.com",
			database: "database",
		};
		const connString =
      "mssql://user:securePassword@testing.com:12345/database?encrypt=true&request%20timeout=30000";

		const result = buildConnectionString(formData);

		expect(result).toBe(connString);
	});

	it("Should default the port to 1433 if no port is provided", () => {
		const formData = {
			user: "user",
			password: "securePassword",
			host: "testing.com",
			database: "database",
		};
		const connString =
      "mssql://user:securePassword@testing.com:1433/database?encrypt=true&request%20timeout=30000";

		const result = buildConnectionString(formData);

		expect(result).toBe(connString);
	});

	it("Should throw an error on blank form data", () => {
		expect(() => {
			buildConnectionString(null);
		}).toThrowError();
	});
});
