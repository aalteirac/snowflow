var express = require('express');
var path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
var fs = require('fs');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
var snowflake = require('snowflake-sdk');
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log('Example app listening on port '+port);
})
var connection = snowflake.createConnection( {
  account: process.env.ACCOUNT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
  }
  );
  connection.connect( 
    function(err, conn) {
        if (err) {
            console.error('Unable to connect: ' + err.message);
            } 
        }
  )

  function terminate(conne){
    conne.destroy(function(err, conn) {
      if (err) {
        console.error('Unable to disconnect: ' + err.message);
      } else {
        console.log('Disconnected connection with id: ' + conne.getId());
      }
    });

  }

  function dumpitToStage(nm){
    var statement =connection.execute({
      sqlText: `PUT file://${__dirname}/${nm}.csv @ANTHONYDB.PUBLIC.MYSTAGE;`, // @DATABASE.SCHEMA.%TABLE; //@ANTHONYDB.PUBLIC.%RAWDT;
      complete: function (err) {
        var stream = statement.streamRows();
        stream.on('data', function (row){
         
        });
        stream.on('end', function (row){
          fs.unlinkSync(`${__dirname}/${nm}.csv`)
          connection.execute({
            sqlText: 'COPY INTO ANTHONYDB.PUBLIC.RAWDT from @ANTHONYDB.PUBLIC.MYSTAGE purge = true',
            complete: function(err, stmt, rows) {
              if (err) {
                console.error('Failed to execute statement due to the following error: ' + err.message);
              } else {
                console.log('COPY Successfully executed statement: ' + stmt.getSqlText());
              }
              //terminate(connection);
            }
          });
        });
      }
    });    
  }

  function writeToStage(mess){
    const csvWriter = createCsvWriter({
      //path: 'test.csv',
      path: mess.ts+'.csv',
      header: ['TS','USERNAME','ACTION','PARAM','PLAYER','GAMEID']
    });

    const data = [
      {
        TS: mess.ts,
        USERNAME: mess.user,
        ACTION: mess.action,
        PARAM: mess.param,
        PLAYER: mess.player,
        GAMEID: mess.gameID
      }
    ];
    csvWriter.writeRecords(data) .then(()=> {
    dumpitToStage(mess.ts);
    })
  }

app.post('/msg', async function (req, res) {
  writeToStage(req.body);
  res.send({message_back:"got it!"});

})
app.get('/', async function (req, res) {
  res.redirect("/game")
})
app.use(express.static(path.join(__dirname, "/public")));

