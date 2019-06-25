const electron = require("electron");
const { ipcMain } = electron;
const processMetaData = require("./DBMetadata/metadataProcessor");
const generateGraphQL = require("./Generators/graphQLGenerator");
const dbFactory = require("./dbFactory");
const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
const events = require("./events");
const PgSqlProvider = require("./Generators/classes/pgSqlProvider");

let schemaMetaData;
let mutationsMetaData;
let queriesMetaData;

ipcMain.on(events.URL, async (event, connData) => {
  try {
    const cd = JSON.parse(connData);
    console.log(cd)
    const { retriever, translator, provider } = dbFactory(cd);
    console.log("TRANSLATOR", translator)

    const connString =
      cd.value.length === 0 ? retriever.buildConnectionString(cd) : cd.value;

    console.log("GETTING METADATA")
    const dbMetaData = await retriever.getSchemaInfo(connString);

    console.log(dbMetaData)
    console.log("GETTING FORMATTED METADATA")
    const formattedMetaData = processMetaData(dbMetaData, translator);

    ({
      types: schemaMetaData,
      mutations: mutationsMetaData,
      queries: queriesMetaData
    } = generateGraphQL(formattedMetaData.tables, provider));

    const gqlData = {
      schema: schemaMetaData,
      mutations: mutationsMetaData,
      queries: queriesMetaData
    };
    fs.writeFile("output.txt", JSON.stringify(gqlData), function(err) {
        if (err) {
            console.log(err);
        }
    });

    event.sender.send(events.DATA, JSON.stringify(gqlData));
  } catch (err) {
    console.log(err)
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
