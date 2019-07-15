/* eslint-disable no-undef */
import retrieved from "./sampleFiles/retrievedMetadata";
import processMetadata from "./metadataProcessor";
import * as translators from "./columnTypeTranslators";

describe("Format Metadata Tests", () => {
	let pm;

	beforeAll(() => {
		pm = processMetadata(translators.pgSQL);
	});

	it("Throws an error on null or empty data", () => {
		const metadataTest = () => {
			pm([]);
		};

		expect(metadataTest).toThrowError("Metadata is null or empty");
	});

	it("Throws an error on non array input", () => {
		const metadataTest = () => {
			pm({});
		};

		expect(metadataTest).toThrowError(
			"Invalid data format. Column Data must be an array"
		);
	});

	it("Should match the snapshot", () => {
		const result = pm(retrieved);
		expect(result).toMatchSnapshot();
	});
});
