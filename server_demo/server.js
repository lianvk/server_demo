// server.js

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');


const app            = express();

const port = 8000;
const jsonParser = express.json();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
                      
  // Make sure you add the database name and not the collection name
  //const datadb = database.db("map")

const datadb = database.db("map");

  require('./app/routes')(app, datadb);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})

app.use("/", express.static(__dirname + "/"));

