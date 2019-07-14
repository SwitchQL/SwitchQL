import generateGraphQL from "./graphQLGenerator";
import mutationOutput from "./sampleFiles/mutationOutput";
import queryOutput from "./sampleFiles/queryOutput";
import input from "../DBMetadata/sampleFiles/processedMetadata";
import PgSqlProvider from "./classes/pgSqlProvider";

describe("Mutation Generation Tests", () => {
	it("Should return an empty string on empty input", () => {
		const { mutations: result } = generateGraphQL(
			{},
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toBe("");
	});

	it("Should match the snapshot", () => {
		const { mutations: result } = generateGraphQL(
			input.tables,
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toMatchSnapshot();
	});
});

describe("Query Generation Tests", () => {
	it("Should correctly generate queries given input file", () => {
		const { queries: result } = generateGraphQL(
			input.tables,
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toBe(queryOutput);
	});

	it("Should return an empty string on empty input", () => {
		const { queries: result } = generateGraphQL(
			{},
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toBe("");
	});

	it("Should match the snapshot", () => {
		const { queries: result } = generateGraphQL(
			input.tables,
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);
		expect(result).toMatchSnapshot();
	});
});

describe("Type generation tests", () => {
	it("Should match the snapshot", () => {
		const { types: output } = generateGraphQL(
			input.tables,
			new PgSqlProvider("postgres://test@test.com:5432/test")
		);

		expect(output).toMatchSnapshot();
	});
});
