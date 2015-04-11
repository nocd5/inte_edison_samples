var React = require('react');
var Components = require('./components.jsx')

var Jumbotron = Components.Jumbotron;
var Panel = Components.Panel;
var Switch = Components.Switch;
var Button = Components.Button;
var Chart = Components.Chart;

var _Content = React.createClass({
  render: function() {
    return(
      <div>
        <Jumbotron text="Intel Edison" />
        <Panel title="Koshian/Uzuki" id="panel" />
      </div>
    );
  },
  componentDidMount: function(){
    React.render(<Chart/>, document.getElementById("chart"));
    React.render(<Button/>, document.getElementById("button"));
  }
});

module.exports = _Content;

// <GoogleLineChart graphName="chart" text="Now Loading ..." />
