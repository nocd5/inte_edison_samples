var http = require('http');
var express = require('express');
var wsServer = require('ws').Server;
var pg = require('pg');
var date = require('date-utils');
var subscriber = require('./subscriber');

pg.connect(process.env.DATABASE_URL, function(error, client){
  if (error){
    console.log("Could not connect to DB: " + error);
    startServer([]);
  }
  else {
    var rows = [];
    var query = client.query('SELECT date, temp, rh FROM temprh;');
    query.on('row', function(row){
      row["temp"] = Number(row["temp"]);
      row["rh"] = Number(row["rh"]);
      rows.push(row);
    });
    query.on('end', function(row, err){
      var date = new Date();
      date.setDate(date.getDate() - 1);
      client.query("DELETE FROM temprh WHERE date < $1;", [ date ]);
      rows = rows.sort(function(a, b){
        if (a["date"] < b["date"]) return -1;
        if (a["date"] > b["date"]) return 1;
        return 0;
      });
      client.end.bind(client);
      startServer(rows);
    });
    query.on('error', function(err){
      console.log("ERROR!!" + err);
    });
  }
});

function startServer(init){
  var port = process.env.PORT || 8080;
  var app = express();
  app.use(express.static(__dirname + '/public'));

  var server = http.createServer(app)
  server.listen(port)

  var bufferSize = process.env.DATA_BUFFER_SIZE;
  var dataBuffer = init;
  dataBuffer = dataBuffer.slice(dataBuffer.length - bufferSize);

  var wss = new wsServer({server: server});
  wss.on('connection', function(ws){
    ws.send(JSON.stringify(dataBuffer));
  });

  var _subscriber = new subscriber();
  _subscriber.on('message', function(data){
    pg.connect(process.env.DATABASE_URL, function(error, client){
      if (error){
        console.log("Could not connect to DB: " + error);
      }
      else {
        // "Sun May 31 2015 23:25:43 GMT+0900" format is not accepted to PostgerSQL.
        // convert to "Sun May 31 2015 23:25:43+0900"
        client.query(
          "INSERT INTO temprh (date, temp, rh) values($1, $2, $3) RETURNING id;",
          [ data["date"].replace(/ GMT\+(\d{4}).*/, "+$1"), data["temp"], data["rh"] ],
          function (err, result){
            if (err){
              console.log("INSERT QUERY ERROR : " + err);
            }
            else {
              console.log('row inserted with id: ' + result.rows[0].id);
            }
            client.end();
          }
        );
      }
    });

    dataBuffer.push(data);
    dataBuffer = dataBuffer.slice(dataBuffer.length - bufferSize);
    wss.clients.forEach(function(c){
      c.send(JSON.stringify(dataBuffer));
    });
  });
}
