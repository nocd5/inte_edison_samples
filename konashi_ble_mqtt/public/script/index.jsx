var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var Jumbotron = ReactBootstrap.Jumbotron;

var JumbotronBox = React.createClass({
  render: function() {
    return(
      <Jumbotron>
        <h1>{this.props.text}</h1>
      </Jumbotron>
    );
  }
});

var MyButton = React.createClass({
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
      disconnect();
    }
    else {
      connect();
    }
  }
});

var BSSwitch = React.createClass({
  getInitialState: function() {
    return { checked: true };
  },
  render: function(){
    return (
      <input type="checkbox" name={this.props.name} />
    );
  },
  componentDidMount: function() {
    $("[name='"+this.props.name+"']").bootstrapSwitch({
        state: this.state.checked,
        onColor: this.props.onColor,
        offColor: this.props.offColor,
        handleWidth: this.props.handleWidth,
        onSwitchChange: this.handleChange
    });
  },
  handleChange: function(_event, _state) {
    if (_state){
      connect();
    }
    else {
      disconnect();
    }
  }
});

var GoogleLineChart = React.createClass({
  render: function(){
    return(
      <div id={this.props.graphName}>{this.props.text}</div>
    );
  },
  componentDidMount: function(){
    this.drawCharts();
  },
  componentDidUpdate: function(){
    this.drawCharts();
  },
  drawCharts: function(){
    var data = this.props.data;
    var options = this.props.options;

    var chart = new google.visualization.LineChart(
      document.getElementById(this.props.graphName)
    );
    if (data != null){
      chart.draw(data, options);
    }
  }
});

var BSPanel = React.createClass({
  render: function() {
    return(
      <Panel header={this.props.title} bsStyle="primary">
        <center>
          <GoogleLineChart graphName="chart" text="Now Loading ..." />
          <div id="switch" className="switch"></div>
          <div id="button" className="button"></div>
        </center>
      </Panel>
    );
  }
});

React.render(<JumbotronBox text="Intel Edison" />, document.getElementById("header"));
React.render(<BSPanel title="Koshian/Uzuki" />, document.getElementById("panel"));
React.render(<BSSwitch name="switch" onColor="primary" handleWidth="50" />, document.getElementById("switch"));
// React.render(<MyButton/>, document.getElementById("button"));
