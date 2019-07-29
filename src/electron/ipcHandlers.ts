import { ipcMain } from 'electron';
import generateGraphQL from "../Generators/graphQLGenerator";
import dbFactory from "../dbFactory";
import { createWriteStream } from 'fs'
import * as JSZip from "jszip";
import { join } from 'path'
import * as events from "../events";
import ConnData from '../models/connData';

let schemaMetaData: string;
let mutationsMetaData: string;
let queriesMetaData: string;

ipcMain.on(events.URL, async (event: any, connData: string) => {
	try {
		const cd: ConnData = JSON.parse(connData);
		const { retriever, processMetaData, provider } = dbFactory(cd);

		const connString =
      cd.value.length === 0 ? retriever.buildConnectionString(cd) : cd.value;

		const dbMetaData = await retriever.getSchemaInfo(connString);
		const formattedMetaData = processMetaData(dbMetaData);

		({
			types: schemaMetaData,
			mutations: mutationsMetaData,
			queries: queriesMetaData,
		} = generateGraphQL(formattedMetaData.tables, provider));

		const gqlData = {
			schema: schemaMetaData,
			mutations: mutationsMetaData,
			queries: queriesMetaData,
		};

		event.sender.send(events.DATA, JSON.stringify(gqlData));
	} catch (err) {
		event.sender.send(events.APP_ERROR, JSON.stringify(err));
	}
});

ipcMain.on(events.DIRECTORY, async (event: any, directory: string) => {
	try {
		const zip = new JSZip();

		zip.file("Schema.js", schemaMetaData);
		zip.file("clientMutations.js", mutationsMetaData);
		zip.file("clientQueries.js", queriesMetaData);

		zip
			.generateNodeStream({ type: "nodebuffer", streamFiles: true })
			.pipe(createWriteStream(join(directory, "SwitchQL.zip")))
			.on("finish", () => {
				// JSZip generates a readable stream with a "end" event,
				// but is piped here in a writable stream which emits a "finish" event.
				event.sender.send(events.EXPORT_SUCCESS);
			});
	} catch (err) {
		event.sender.send(events.APP_ERROR, JSON.stringify(err));
	}
});
