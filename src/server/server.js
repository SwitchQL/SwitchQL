const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dbController = require('./dbController.js');

const app = express();


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/getInfo', dbController.getSchemaInfo, (req, res) => {
  console.log(res.locals.schemaInfo)
  res.status(200).json(res.locals.schemaInfo);
})

app.listen(3000, (err) => {
if(err) console.log(err);
else console.log('working server-side');
});
