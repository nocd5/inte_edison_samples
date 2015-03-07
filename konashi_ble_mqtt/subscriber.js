var mqtt = require('mqtt');
var http = require("http");
var express = require('express');
var wsServer = require('ws').Server;

/*
  execute the following
  > heroku config:add MQTT_HOST=MqttBrokerHost
  > heroku config:add MQTT_PORT=MqttBrokerPort
  > heroku config:add MQTT_USERNAME=UserName
  > heroku config:add MQTT_PASSWORD=PassWord
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

var wss = new wsServer({"server":server});

client.subscribe('nocd5@github/#');
client.on('message', function(topic, message) {
  data = JSON.parse(message);
  t = topic.split("/");
  if(t[1] == 'Koshian') {
    console.log(topic + ": " + message);
    var dataAry = [data["date"], data["temp"], data["rh"]];
    wss.clients.forEach(function(c){
      c.send(JSON.stringify(dataAry));
    });
  }
});

