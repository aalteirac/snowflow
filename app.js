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

  function dumpitToStage(){
    var statement =connection.execute({
      sqlText: 'PUT file:///Users/aalteirac/nodes/snowflow/test.csv @ANTHONYDB.PUBLIC.MYSTAGE;', // @DATABASE.SCHEMA.%TABLE; //@ANTHONYDB.PUBLIC.%RAWDT;
      complete: function (err)
      {
        var stream = statement.streamRows();
        stream.on('data', function (row)
        {
          console.log(row);
        });
        stream.on('end', function (row)
        {
          console.log('All rows consumed');

          connection.execute({
            sqlText: 'COPY INTO ANTHONYDB.PUBLIC.RAWDT from @ANTHONYDB.PUBLIC.MYSTAGE purge = true force = true',
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
      path: 'test.csv',
      header: ['ID','VALUE','DT','DESCRIPTION']
    });

    const data = [
      {
        ID: 10,
        VALUE: randomInteger(1,100000),
        DT: Date.now(),
        DESCRIPTION: mess
      }
    ];

    csvWriter.writeRecords(data) .then(()=> 
        console.log('The CSV file was written successfully'));
        dumpitToStage();
    }

  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/msg', async function (req, res) {
  writeToStage(req.body.message);
  res.send({message_back:req.body.message +" from me"});

})
app.use(express.static(path.join(__dirname, "/public")));

