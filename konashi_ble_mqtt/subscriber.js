var mqtt = require('mqtt');
var http = require("http");
var express = require('express');
var wsServer = require('ws').Server;
var pg = require('pg');
var date = require('date-utils');

/*
  execute the following
  > heroku config:add MQTT_HOST=MqttBrokerHost
  > heroku config:add MQTT_PORT=MqttBrokerPort
  > heroku config:add MQTT_USERNAME=UserName
  > heroku config:add MQTT_PASSWORD=PassWord
  > heroku config:add DATA_BUFFER_SIZE=BufferSize
*/
var client = mqtt.connect({
  host:process.env.MQTT_HOST,
  port:process.env.MQTT_PORT,
  username:process.env.MQTT_USERNAME,
  password:process.env.MQTT_PASSWORD
});

pg.connect(process.env.DATABASE_URL, function(err, client){
  var rows = [];
  var query = client.query('SELECT date, temp, rh FROM temprh;');
  query.on('row', function(row){
    row["temp"] = Number(row["temp"]);
    row["rh"] = Number(row["rh"]);
    rows.push(row);
  });
  query.on('end', function(row,err){
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var expireDate = date.toFormat("YYYY-MM-DD HH24:MI:SS");
    client.query("DELETE FROM temprh WHERE date < '" + expireDate + "';");
    rows = rows.sort(function(a, b){
      if (a["date"] < b["date"]) return -1;
      if (a["date"] > b["date"]) return 1;
      return 0;
    });
    startServer(rows);
  });
  query.on('error', function(error){
    console.log("ERROR!!" + error);
  });
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

  var wss = new wsServer({"server": server});
  wss.on('connection', function(ws){
    ws.send(JSON.stringify(dataBuffer));
  });

  client.subscribe('nocd5@github/#');
  client.on('message', function(topic, message){
    data = JSON.parse(message);
    t = topic.split("/");
    if (t[1] == 'Koshian'){
      console.log(topic + ": " + message);

      pg.connect(process.env.DATABASE_URL, function(err, client){
        if (err) response.send("Could not connect to DB: " + err);
        var query = client.query(
          "INSERT INTO temprh (date, temp, rh) values($1, $2, $3);",
          [ data["date"], data["temp"], data["rh"] ],
          function (err, result){
            if (err) {
              console.log("INSERT QUERY ERROR : " + err);
            } else {
              console.log('row inserted with id: ' + result.rows[0].id);
            }
          }
        );
      });

      dataBuffer.push(data);
      dataBuffer = dataBuffer.slice(dataBuffer.length - bufferSize);
      wss.clients.forEach(function(c){
        c.send(JSON.stringify(dataBuffer));
      });
    }
  });
}
