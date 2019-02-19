const electron = require("electron");
const { ipcMain } = electron;
const dbController = require("./DBMetadata/pgMetadataRetriever");
const processMetaData = require("./DBMetadata/pgMetadataProcessor");
const generateGraphqlServer = require("./Generators/typeGenerator");
const generateMutations = require("./Generators/mutationGenerator");
const generateQueries = require("./Generators/queryGenerator");
const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
const events = require("./events");

let schemaMetaData;
let mutationsMetaData;
let queriesMetaData;

ipcMain.on(events.URL, async (event, info) => {
  try {
    info = JSON.parse(info);
    if (info.value.length === 0) {
      info.value = dbController.buildConnectionString(info);
    }

    let dbMetaData = await dbController.getSchemaInfoPG(info.value);
    const formattedMetaData = await processMetaData(dbMetaData);

    schemaMetaData = await generateGraphqlServer(
      formattedMetaData.tables,
      info.type,
      info.value
    );

    mutationsMetaData = await generateMutations(formattedMetaData.tables);
    queriesMetaData = await generateQueries(formattedMetaData.tables);

    const gqlData = {
      schema: schemaMetaData,
      mutations: mutationsMetaData,
      queries: queriesMetaData
    };
    event.sender.send(events.DATA, JSON.stringify(gqlData));
  } catch (err) {
    event.sender.send(events.APP_ERROR, JSON.stringify(err));
  }
});

ipcMain.on(events.DIRECTORY, async (event, directory) => {
  try {
    const zip = new JSZip();

    zip.file("Schema.js", schemaMetaData);
    zip.file("clientMutations.js", mutationsMetaData);
    zip.file("clientQueries.js", queriesMetaData);

    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(fs.createWriteStream(path.join(directory, "SwitchQL.zip")))
      .on("finish", function() {
        // JSZip generates a readable stream with a "end" event,
        // but is piped here in a writable stream which emits a "finish" event.
        event.sender.send(events.EXPORT_SUCCESS);
      });
  } catch (err) {
    event.sender.send(events.APP_ERROR, JSON.stringify(err));
  }
});
