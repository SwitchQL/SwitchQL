// const path = require('path');
// const dbController = require('./dbController.js');
const electron = require('electron');
const { ipcMain } = electron;
const dbController = require('./dbController.js');
const logicController = require('./logicController');

ipcMain.on('url', async (event, url) => {
  const dbMetaData = await dbController.getSchemaInfo(url);
  const formattedMetaData = await logicController.formatMetaData(dbMetaData);
  console.log(formattedMetaData);
  event.sender.send('testback', JSON.stringify(formattedMetaData));
});

// app.post('/getInfo', dbController.getSchemaInfo, (req, res) => {
//   console.log(res.locals.schemaInfo)
//   res.status(200).json(res.locals.schemaInfo);
// })

// app.listen(3000, (err) => {
// if(err) console.log(err);
// else console.log('working server-side');
// });
