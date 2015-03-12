var mqtt = require('mqtt');
var http = require("http");
var express = require('express');
var wsServer = require('ws').Server;
var pg = require('pg');

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

var port = process.env.PORT || 8080;

var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app)
server.listen(port)

var bufferSize = process.env.DATA_BUFFER_SIZE;
var dataBuffer = new Array(bufferSize);
for (var i = 0; i < bufferSize; i++){
  dataBuffer[i] = new Array(3);
  for (var j = 0; j < 3; j++){
    dataBuffer[i][j] = 0;
  }
}

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM temprh', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});

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

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      var query = client.query("insert into temprh (temp,rh,date) values('"
          + data["temp"] + "','" + data["rh"] + "','" + data["date"] + "');");
      query.on('end', function(row,err) {
        console.log("query end");
      });
      query.on('error', function(error) {
        console.log("ERROR!");
      });
    });

    var dataAry = [data["date"], data["temp"], data["rh"]];
    dataBuffer.push(dataAry);
    dataBuffer = dataBuffer.slice(dataBuffer.length - bufferSize);
    wss.clients.forEach(function(c){
      c.send(JSON.stringify(dataBuffer));
    });
  }
});

