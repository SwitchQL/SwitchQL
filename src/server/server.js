// const path = require('path');
// const dbController = require('./dbController.js');
const electron = require('electron');
const { ipcMain } = electron;
const dbController = require('./dbController.js');
const logicController = require('./logicController');
//const {parseGraphqlServer, toTitleCase, createFindAllRootQuery, buildGraphqlRootQuery, createSubQuery, buildGraphqlTypeSchema} = require('./conversionController');

ipcMain.on('url', async (event, url) => {
  const dbMetaData = await dbController.getSchemaInfo(url);
  const formattedMetaData = await logicController.formatMetaData(dbMetaData);
  const combo = { dbMetaData , formattedMetaData };
  event.sender.send('testback', JSON.stringify(combo));
  // const test = await parseGraphqlServer(formattedMetaData.tables);
  // console.log(test);
});

// app.post('/getInfo', dbController.getSchemaInfo, (req, res) => {
//   console.log(res.locals.schemaInfo)
//   res.status(200).json(res.locals.schemaInfo);
// })

// app.listen(3000, (err) => {
// if(err) console.log(err);
// else console.log('working server-side');
// });
