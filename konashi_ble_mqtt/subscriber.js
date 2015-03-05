var mqtt = require('mqtt');
var client = mqtt.connect({
  host:'192.168.11.5',
  port:61613,
  username:'admin',
  password:'password'
});

var wsServer = require('ws').Server;

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app);

var konashiWs = new wsServer({"port":8016});

client.subscribe('nocd5@github/#');

client.on('message', function(topic, message) {
  data = JSON.parse(message);
  t = topic.split("/");
  if(t[1] == 'Koshian') {
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

