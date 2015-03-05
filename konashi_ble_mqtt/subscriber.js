var mqtt = require('mqtt'),
    client = mqtt.connect('mqtt://admin:password@192.168.2.2:61613');
var wsServer = require('ws').Server;

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app);

var konashiWs = new wsServer({"port":8016});

client.subscribe('Konashi/#');

client.on('message', function(topic, message) {
  data = JSON.parse(message);
  t = topic.split("/");
  if(t[1] == 'Uzuki') {
    console.log(topic + ": " + message);
    var dataAry = [data["date"], data["temp"], data["rh"]];
    konashiWs.clients.forEach(function(c){
      c.send(JSON.stringify(dataAry));
    });
  }
});

// Start Http Server
app.use(express.static(__dirname + '/public'));
server.listen(8080);
console.log('Server running');
console.log('root :' + __dirname + '/public');
server.on('connection', function(socket){
  console.log('connected: ' + socket.remoteAddress);
});

