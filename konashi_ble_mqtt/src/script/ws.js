var _WebSocket = {
  host : location.origin.replace(/^http/, 'ws'),
  ws : null,
  retryCount : 0,
  autoReconnect : true,
  maxRetry: 10,
  eventListener: function(message){ },
  initialize : function(){
    this.ws = new(window.WebSocket || window.MozWebSocket)(this.host, "websocket");
    this.ws.addEventListener('open', function(event){
      console.log("connected");
      this.retryCount = 0;
    });
    this.ws.addEventListener('close', function(event){
      console.log("disconnected");
      if ((this.autoReconnect === true) && (this.maxRetry > this.retryCount++)){
        console.log("retry count : " + this.retryCount);
        top.initialize();
      }
    });
    this.ws.addEventListener('message', this.eventListener);
  },
  disconnect: function(){
    this.autoReconnect = false;
    this.ws.close();
    this.ws = null;
  },
  connect: function(){
    this.initialize();
    this.autoReconnect = true;
  }
};

module.exports = _WebSocket;
