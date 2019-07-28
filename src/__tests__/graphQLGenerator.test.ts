/* eslint-disable no-undef */
import generateGraphQL from "../server/Generators/graphQLGenerator";
import input from "./sampleFiles/processedMetadata";
import PgSqlProvider from "../server/Generators/provider/pgSqlProvider";

describe("Mutation Generation Tests", () => {
	it("Should return an empty string on empty input", () => {
		const { mutations: result } = generateGraphQL(
			{},
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toBe("");
	});

	// TODO Fix Test
	// it("Should match the snapshot", () => {
	// 	const { mutations: result } = generateGraphQL(
	// 		input.tables,
	// 		new PgSqlProvider("postgres://test@test.com:5432/test")
	// 	);
	// 	expect(result).toMatchSnapshot();
	// });
});

describe("Query Generation Tests", () => {
	it("Should return an empty string on empty input", () => {
		const { queries: result } = generateGraphQL(
			{},
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toBe("");
	});

	// TODO Fix Test
	// it("Should match the snapshot", () => {
	// 	const { queries: result } = generateGraphQL(
	// 		input.tables,
	// 		new PgSqlProvider("postgres://test@test.com:5432/test")
	// 	);
	// 	expect(result).toMatchSnapshot();
	// });
});

describe("Type generation tests", () => {
	// TODO Fix Test
	// it("Should match the snapshot", () => {
	// 	const { types: output } = generateGraphQL(
	// 		input.tables,
	// 		new PgSqlProvider("postgres://test@test.com:5432/test")
	// 	);

	// 	expect(output).toMatchSnapshot();
	// });
});