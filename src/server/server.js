// const path = require('path');
// const dbController = require('./dbController.js');
const electron = require('electron');
const { ipcMain } = electron;
const dbController = require('./dbController.js');
const logicController = require('./logicController');
const {parseGraphqlServer, toTitleCase, createFindAllRootQuery, buildGraphqlRootQuery, createSubQuery, buildGraphqlTypeSchema} = require('../parser');
const {parseClientQueries} = require('../clientQueries');
const {parseClientMutations} = require('../clientMutations');

ipcMain.on('url', async (event, url) => {
  const dbMetaData = await dbController.getSchemaInfo(url);
  const formattedMetaData = await logicController.formatMetaData(dbMetaData);
  
  // const parsedMetaData = await parseGraphqlServer(formattedMetaData.tables);
  // const clientQ = await parseClientQueries(formattedMetaData.tables);
  const clientM = await parseClientMutations(formattedMetaData.tables);
  event.sender.send('testback',clientM);
  // const test = await parseGraphqlServer(formattedMetaData.tables);
  // console.log(clientQ);
});

