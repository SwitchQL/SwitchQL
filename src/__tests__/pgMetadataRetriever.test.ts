/* eslint-disable no-undef */
import pgMetadataRetriever from "../server/DBMetadata/pgMetadataRetriever";
import DBType from "../models/dbType";

test("takes in object with data returns properly formatted string", () => {
	expect(
		pgMetadataRetriever.buildConnectionString({
			user: "user",
			password: "securePassword",
			port: "5432",
			host: "stampy.db.elephantsql.com",
			database: "database",
			value: "",
			type: DBType.PostgreSQL
		})
	).toBe(
		"postgres://user:securePassword@stampy.db.elephantsql.com:5432/database"
	);
});
