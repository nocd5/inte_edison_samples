var chart = null;
var currentData = null
var chart1Options = {
  title: 'Koshian/Uzuki',
  width: window.innerWidth * 0.95,
  height: window.innerHeight * 0.6,
  pointSize: 2,
  chartArea: {'width':'80%', 'height':'50%', 'left':60 },
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
    title:'Values',
    titleTextStyle:{italic:false},
    slantedText:true,
    maxValue: 100,
    minValue: 0,
  },
  explorer: { actions: ['dragToZoom', 'rightClickToReset'], maxZoomIn:0.01 },
};

window.addEventListener('resize', function(){
  chart1Options["width"] = window.innerWidth * 0.95;
  chart1Options["height"] = window.innerHeight * 0.6;
  drawChart();
});

google.load('visualization', '1.0', {'packages':['corechart'], 'language': 'en'});
google.setOnLoadCallback(function(){
  connect();
});

function drawChart(values){
  if (values == null){
    if (this.currentData != null){
      this.chart.draw(this.currentData, this.chart1Options);
    }
    return;
  }

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn('datetime', 'Time');
  dataTable.addColumn('number', 'Temperature[degC]');
  dataTable.addColumn('number', 'Humidity[%RH]');
  dataTable.addRows(values);
  var formatter = new google.visualization.DateFormat({pattern: 'yyyy/MM/dd HH:mm:ss'});
  formatter.format(dataTable, 0);
  this.chart.draw(dataTable, this.chart1Options);

  this.currentData = dataTable;
}

