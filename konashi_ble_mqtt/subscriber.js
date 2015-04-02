var mqtt = require('mqtt');

var onMessageEventHandler = function(data){ };

var Subscriber = function(){
  /*
    execute the following
    > heroku config:add MQTT_HOST=MqttBrokerHost
    > heroku config:add MQTT_PORT=MqttBrokerPort
    > heroku config:add MQTT_USERNAME=UserName
    > heroku config:add MQTT_PASSWORD=PassWord
    > heroku config:add DATA_BUFFER_SIZE=BufferSize
  */
  var mqtt_client = mqtt.connect({
    host:process.env.MQTT_HOST,
    port:process.env.MQTT_PORT,
    username:process.env.MQTT_USERNAME,
    password:process.env.MQTT_PASSWORD
  })

  mqtt_client.subscribe('nocd5@github/#');
  mqtt_client.on('message', function(topic, message){
    var t = topic.split("/");
    if (t[1] == 'Koshian'){
      console.log(topic + ": " + message);
      onMessageEventHandler(JSON.parse(message));
    }
  });
};

Subscriber.prototype.on = function(m,f){
  if (m == 'message'){
    onMessageEventHandler = f;
  }
};

module.exports = Subscriber;
