const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dbController = require('./dbController.js')

const app = express();

app.use(bodyParser.json());

app.listen(3000, (err) => {
console.log(err);
});

app.post('/getInfo', dbController.getSchemaInfo, (req, res) => {
  res.status(200).json(res.locals.schemaInfo);
})