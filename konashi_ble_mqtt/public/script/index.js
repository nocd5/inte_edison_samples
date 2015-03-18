var host = location.origin.replace(/^http/, 'ws');
var ws = null;
const maxRetry = 10;
var retryCount = 0;
var autoReconnect = true;

function initialize(){
  this.ws = new(window.WebSocket || window.MozWebSocket)(this.host, "websocket");
  this.ws.addEventListener('open', function(event){
    console.log("connected");
    retryCount = 0;
  });
  this.ws.addEventListener('close', function(event){
    console.log("disconnected");
    if ((autoReconnect === true) && (maxRetry > retryCount++)){
      console.log("retry count : " + retryCount);
      top.initialize();
    }
  });
  this.ws.addEventListener('message', function(message){
    drawChart(JSON.parse(message.data).map( function(e){
      var d = [];
      if (e["date"] == 0){
        d = [ null, 0, 0 ];
      }
      else {
        d = [ new Date(e["date"]), e["temp"], e["rh"] ];
      }
      return d;
    }));
  });
}

function disconnect(){
  this.autoReconnect = false;
  this.ws.close();
  this.ws = null;
}

function connect(){
  this.initialize();
  var autoReconnect = true;
}

