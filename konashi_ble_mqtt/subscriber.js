var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://admin:password@192.168.2.2:61613');
var WsServer = require('ws').Server;

var konashiWs = new WsServer({
    host: 'localhost',
    port: 8016
});

client.subscribe('Konashi/#');

client.on('message', function(topic, message) {
  data = JSON.parse(message);
  t = topic.split("/");
  if(t[1] == 'Uzuki') {
    console.log(topic + ": " + message);
    var dataAry = [data["date"], data["temp"], data["rh"]];
    konashiWs.clients.forEach(function(c) {
      c.send(JSON.stringify(dataAry));
    });
  }
});

