// const path = require('path');
// const dbController = require('./dbController.js');
const electron = require('electron');
const { ipcMain } = electron;
const dbController = require('./dbController.js');
const logicController = require('./logicController');
const {parseGraphqlServer, toTitleCase, createFindAllRootQuery, buildGraphqlRootQuery, createSubQuery, buildGraphqlTypeSchema} = require('./parser.js');
const parseClientMutations = require('./clientMutations.js');
const parseClientQueries = require('./clientQueries.js')

ipcMain.on('url', async (event, url) => {
  // outlining the structure of the columns of the database
  const dbMetaData = await dbController.getSchemaInfo(url);
  // post process database metadata 
  const formattedMetaData = await logicController.formatMetaData(dbMetaData);
  // all backend graphQL server code
  const schemaMetaData = await parseGraphqlServer(formattedMetaData.tables, 'PostgreSQL');
  const mutationsMetaData = await parseClientMutations(formattedMetaData.tables);
  const queriesMetaData = await parseClientQueries(formattedMetaData.tables);
  const gqlData = {
    schema: schemaMetaData,
    mutations: mutationsMetaData,
    queries: queriesMetaData,
  }
  event.sender.send('data', JSON.stringify(gqlData));
});

