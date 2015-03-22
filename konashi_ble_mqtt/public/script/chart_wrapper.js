var chart = null;
var currentData = null
var chartWidth = function(){ return $("panel").width; };
var chartHeight = function(){ return (window.innerHeight - 400) };

var chart1Options = {
  colors: [ '#D9534F', '#428BCA' ],
  width: chartWidth(),
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

window.addEventListener('resize', function(){
  chart1Options["width"] = chartWidth();
  chart1Options["height"] = chartHeight();
  drawChart();
});

google.load('visualization', '1.0', {'packages':['corechart'], 'language': 'en'});
google.setOnLoadCallback(function(){
  connect();
});

function drawChart(values){
  if (values == null){
    if (this.currentData != null){
      React.render(
        React.createElement(
          GoogleLineChart,
          { data:this.currentData, graphName:"chart", options:this.chart1Options }
        ),
        document.getElementById("chart")
      );
    }
    return;
  }

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('datetime', 'Time');
  dataTable.addColumn('number', 'Temperature [degC]');
  dataTable.addColumn('number', 'Humidity [%RH]');
  dataTable.addRows(values);
  var formatter = new google.visualization.DateFormat({pattern: 'yyyy/MM/dd HH:mm:ss'});
  formatter.format(dataTable, 0);
  React.render(
    React.createElement(
      GoogleLineChart,
      { data:dataTable, graphName:"chart", options:this.chart1Options }
    ),
    document.getElementById("chart")
  );

  this.currentData = dataTable;
}

