var React = require('react');
var WebSocket = require('./ws.js');
var chart = null;
var currentData = null
var chartWidth = function(){ return document.getElementById("panel").width; };
var chartHeight = function(){ return (window.innerHeight - 400) };

var chart1Options = {
  colors: [ '#D9534F', '#428BCA' ],
  height: chartHeight(),
  chartArea: { width:'90%', height:'70%' },
  pointSize: 2,
  legend: { position:'top', alignment:'end' },
  hAxis: {
      title:'Time',
      titleTextStyle:{italic:false},
      slantedText:true,
      gridlines: {
        units: {
          years: {format: ["yyyy"]},
          months: {format: ["yyyy/MM"]},
          days: {format: ["yyyy/MM/dd"]},
          hours: {format: ["yyyy/MM/dd HH"]},
          minutes: {format: ["HH:mm"]},
          seconds: {format: ["HH:mm:ss"]},
          milliseconds: {format: ['HH:mm:ss.SSS']},
        }
      },
  },
  vAxis: {
    slantedText:true,
    maxValue: 100,
    minValue: 0,
  },
  explorer: { actions: ['dragToZoom', 'rightClickToReset'], maxZoomIn:0.01 },
};

var queue = null;
var wait = 1;
window.addEventListener('resize', function(){
  clearTimeout(queue);
  queue = setTimeout(function(){
    chart1Options["width"] = chartWidth();
    chart1Options["height"] = chartHeight();
    updateChart();
  }, wait);
});

google.load('visualization', '1.0', {'packages':['corechart'], 'language': 'en'});
google.setOnLoadCallback(function(){
  chart = new google.visualization.LineChart(
    document.getElementById("chart")
  );
  WebSocket.connect();
});

function updateChart(values){
  var data = null;
  if (values == null){
    if (this.currentData != null){
      data = this.currentData;
    }
  }
  else {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Temperature [degC]');
    dataTable.addColumn('number', 'Humidity [%RH]');
    dataTable.addRows(values);
    var formatter = new google.visualization.DateFormat({pattern: 'yyyy/MM/dd HH:mm:ss'});
    formatter.format(dataTable, 0);
    data = dataTable;
    this.currentData = dataTable;
  }

  if (data != null){
    chart.draw(data, chart1Options);
  }
}

WebSocket.eventListener = function(message){
  updateChart(JSON.parse(message.data).map(
    function(e){
      var d = [];
      if (e["date"] == 0){
        d = [ null, 0, 0 ];
      }
      else {
        d = [ new Date(e["date"]), e["temp"], e["rh"] ];
      }
      return d;
    }
  ));
};

var GoogleLineChart = React.createClass({displayName: "GoogleLineChart",
  render: function(){
    return(
      React.createElement("div", {id: this.props.graphName}, this.props.text)
    );
  },
  componentDidMount: function(){
    this.drawCharts();
  },
  componentDidUpdate: function(){
    this.drawCharts();
  },
  componentWillUnmount: function(){
  },
  drawCharts: function(){
    var data = this.props.data;
    var options = this.props.options;

    if (data != null){
      chart.draw(data, options);
    }
  }
});

module.exports = GoogleLineChart;

