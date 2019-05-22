const electron = require("electron");
const { ipcMain } = electron;
const pgDBController = require("./DBMetadata/postgres/pgMetadataRetriever");
const pgProcessMetaData = require("./DBMetadata/postgres/pgMetadataProcessor");
const mysqlDBController = require("./DBMetadata/mysql/mysqlMetadataRetriever");
const mysqlProcessMetaData = require("./DBMetadata/mysql/mysqlMetadataProcessor");
const generateGraphQL = require("./Generators/graphQLGenerator");
const fs = require("fs");
const JSZip = require("jszip");
const path = require("path");
const events = require("./events");
const PgSqlProvider = require("./Generators/classes/pgSqlProvider");

let schemaMetaData;
let mutationsMetaData;
let queriesMetaData;

ipcMain.on(events.URL, async (event, info) => {
  info = JSON.parse(info);
  if (info.type == "MySQL") {
    try {
      if (info.value.length === 0) {
        info.value = mysqlDBController.buildConnectionString(info);
      }

      const dbMetaData = await mysqlDBController.getSchemaInfoPG(info.value);
      const formattedMetaData = mysqlProcessMetaData(dbMetaData);

      ({
        types: schemaMetaData,
        mutations: mutationsMetaData,
        queries: queriesMetaData
      } = generateGraphQL(
        formattedMetaData.tables,
        new PgSqlProvider(info.value)
      ));

      const gqlData = {
        schema: schemaMetaData,
        mutations: mutationsMetaData,
        queries: queriesMetaData
      };
      event.sender.send(events.DATA, JSON.stringify(gqlData));
    } catch (err) {
      event.sender.send(events.APP_ERROR, JSON.stringify(err));
    }
  } else if (info.type == "PostgreSQL") {
    try {
      if (info.value.length === 0) {
        info.value = pgDBController.buildConnectionString(info);
      }

      const dbMetaData = await pgDBController.getSchemaInfoPG(info.value);
      const formattedMetaData = pgProcessMetaData(dbMetaData);

      ({
        types: schemaMetaData,
        mutations: mutationsMetaData,
        queries: queriesMetaData
      } = generateGraphQL(
        formattedMetaData.tables,
        new PgSqlProvider(info.value)
      ));

      const gqlData = {
        schema: schemaMetaData,
        mutations: mutationsMetaData,
        queries: queriesMetaData
      };
      event.sender.send(events.DATA, JSON.stringify(gqlData));
    } catch (err) {
      event.sender.send(events.APP_ERROR, JSON.stringify(err));
    }
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
