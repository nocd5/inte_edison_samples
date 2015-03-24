var React = require('react');
var WebSocket = require('./ws.js');
var ReactBootstrap = require('react-bootstrap');
var GoogleLineChart = require('./chart_wrapper.js');

var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Jumbotron = ReactBootstrap.Jumbotron;

var _Jumbotron = React.createClass({
  render: function() {
    return(
      <Jumbotron>
        <h1>{this.props.text}</h1>
      </Jumbotron>
    );
  }
});

var _Button = React.createClass({
  getInitialState: function() {
    return { checked: true };
  },
  render: function() {
    return (
      <Button onClick={this.handleClick} bsStyle={this.state.checked ? "primary" : "" } bsSize="large" block>
        {this.state.checked ? "Disconnect" : "Connect" }
      </Button>
    );
  },
  handleClick: function() {
    this.setState({ checked: !this.state.checked });
    if (this.state.checked){
      WebSocket.disconnect();
    }
    else {
      WebSocket.connect();
    }
  }
});

var _Switch = React.createClass({
  getInitialState: function() {
    return { checked: true };
  },
  render: function(){
    return (
      <input type="checkbox" name={this.props.name} />
    );
  },
  componentDidMount: function() {
    bootstrapSwitch({
      state: this.state.checked,
      onColor: this.props.onColor,
      offColor: this.props.offColor,
      handleWidth: this.props.handleWidth,
      onSwitchChange: this.handleChange
    });
  },
  handleChange: function(_event, _state) {
    if (_state){
      WebSocket.connect();
    }
    else {
      WebSocket.disconnect();
    }
  }
});

var _Panel = React.createClass({
  render: function() {
    return(
      <Panel header={this.props.title} bsStyle="primary" id={this.props.id}>
        <center>
          <div id="chart" className="chart"></div>
          <div id="button" className="button"></div>
        </center>
      </Panel>
    );
  }
});

module.exports.Jumbotron = _Jumbotron;
module.exports.Button = _Button;
module.exports.Switch = _Switch;
module.exports.Panel = _Panel;
module.exports.Chart = GoogleLineChart;

