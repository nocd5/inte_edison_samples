var mqtt = require('mqtt');
/*
  execute the following
  > export MQTT_HOST=MqttBrokerHost
  > export MQTT_PORT=MqttBrokerPort
  > export MQTT_USERNAME=UserName
  > export MQTT_PASSWORD=PassWord
*/
var client = mqtt.connect({
  host:process.env.MQTT_HOST,
  port:process.env.MQTT_PORT,
  username:process.env.MQTT_USERNAME,
  password:process.env.MQTT_PASSWORD
});

var noble = require('noble');
var date = require('date-utils');
var sprintf = require('sprintf-js').sprintf;

const ADDR_Si7013 = 0x40
const CMD_TEMP    = 0xE3
const CMD_RH      = 0xE5

const KONASHI_SERVICE_UUID        = '229bff0003fb40da98a7b0def65c2d4b'
const KONASHI_I2C_CONFIG_UUID     = '229b300b03fb40da98a7b0def65c2d4b'
const KONASHI_I2C_START_STOP_UUID = '229b300c03fb40da98a7b0def65c2d4b'
const KONASHI_I2C_WRITE_UUID      = '229b300d03fb40da98a7b0def65c2d4b'
const KONASHI_I2C_READ_PARAM_UUID = '229b300e03fb40da98a7b0def65c2d4b'
const KONASHI_I2C_READ_UUID       = '229b300f03fb40da98a7b0def65c2d4b'

const KOSHIAN_I2C_MODE_ENABLE_100K  = 0x01

const KOSHIAN_I2C_CONDITION_STOP    = 0x00
const KOSHIAN_I2C_CONDITION_START   = 0x01
const KOSHIAN_I2C_CONDITION_RESTART = 0x02

var characteristicUUIDs = [KONASHI_I2C_CONFIG_UUID,
                           KONASHI_I2C_START_STOP_UUID,
                           KONASHI_I2C_WRITE_UUID,
                           KONASHI_I2C_READ_PARAM_UUID,
                           KONASHI_I2C_READ_UUID];

function readReg(characteristics, addr, reg, len, func){
  var charaStartStop = characteristics[1];
  var charaWrite     = characteristics[2];
  var charaReadParam = characteristics[3];
  var charaRead      = characteristics[4];
  // send StartCondition
  charaStartStop.write(new Buffer([KOSHIAN_I2C_CONDITION_START]), false, function(error){
    // send register-address/command
    charaWrite.write(new Buffer([2, (addr << 1) & 0xFE, reg]), false, function(error){
      // send RestartCondition
      charaStartStop.write(new Buffer([KOSHIAN_I2C_CONDITION_RESTART]), false, function(error){
        // request data read 
        charaReadParam.write(new Buffer([len, (addr << 1) | 0x01]), false, function(error){
          // send StopCondition
          charaStartStop.write(new Buffer([KOSHIAN_I2C_CONDITION_STOP]), false);
          // read received data
          charaRead.read(function(error, data){
            func(data);
          });
        });
      });
    });
  });
}

function calculateTemperature(data){
  return (data[0]*256 + data[1])*175.72/65536 - 46.85
}

function calculateHumidity(data){
  return (data[0]*256 + data[1])*125/65536 - 6
}

noble.on('stateChange', function(state){
  if (state === 'poweredOn') noble.startScanning();
  else noble.stopScanning();
});

function publishData(temp, rh){
  var date = new Date();
  var data = {"temp":temp, "rh":rh}
  data["date"] = date.toString();
  client.publish('nocd5@github/Koshian', JSON.stringify(data));
}

noble.on('discover', function(peripheral){
  console.log('peripheral with UUID ' + peripheral.uuid + ' found');
  var advertisement = peripheral.advertisement;
  for (var i in advertisement.serviceUuids){
    console.log('advertisement.serviceUuids[' + i + '] = ' + advertisement.serviceUuids[i]);
  }
  var localName = advertisement.localName;
  if (localName){
    console.log('Local Name = ' + localName);
    if (localName.indexOf('Koshian') != -1){
      noble.stopScanning();
    }
    else {
      return;
    }
  }
  else {
      return;
  }

  var timer = null;

  peripheral.on('disconnect', function(){
    if (timer != null){
      clearInterval(timer);
    }
    noble.startScanning();
  });

  peripheral.connect(function(error){
    if (error) console.log('connect error: ' + error);
    console.log('connected to ' + peripheral.uuid);

    peripheral.discoverServices([KONASHI_SERVICE_UUID],
      function (error, services){
        if (error) console.log('discoverServices error: ' + error);
        console.log('services.length: ' + services.length);
        if (services.length === 0){
            noble.startScanning();
            return;
        }

        var konashiService = services[0];
        konashiService.discoverCharacteristics(characteristicUUIDs,
          function(error, characteristics){
            if (error) console.log('discoverCharacteristics error: ' + error);
            console.log('characteristics.length: ' + characteristics.length);
            // enable I2C
            characteristics[0].write(new Buffer([KOSHIAN_I2C_MODE_ENABLE_100K]), false);
            timer = setInterval(function(){
              readReg(characteristics, ADDR_Si7013, CMD_TEMP, 2, function(temp_raw){
                readReg(characteristics, ADDR_Si7013, CMD_RH, 2, function(rh_raw){
                  if (temp_raw && rh_raw){
                    var temp = calculateTemperature(temp_raw);
                    var rh =  calculateHumidity(rh_raw);
                    publishData(temp, rh);
                  }
                });
              });
            }, 5000);
          }
        );
      }
    );
  });
});

