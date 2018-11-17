const electron = require('electron');
const { ipcMain } = electron;
const dbController = require('./dbController.js');
const logicController = require('./logicController');
const {parseGraphqlServer} = require('./parser.js');
const parseClientMutations = require('./clientMutations.js');
const parseClientQueries = require('./clientQueries.js')

ipcMain.on('url', async (event, info) => {
  console.log('hello_world');
  info = JSON.parse(info);
  let dbMetaData =  await dbController.getSchemaInfoPG(info.value);
  const formattedMetaData = await logicController.formatMetaData(dbMetaData);
  console.log(JSON.stringify(formattedMetaData));
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

