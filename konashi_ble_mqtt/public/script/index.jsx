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
      <ReactCheckbox name={this.props.name} />
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

React.render(<JumbotronBox text="Intel Edison" />, document.getElementById("header"));
// React.render(<MyButton/>, document.getElementById("button"));
var BSPanel = React.createClass({
  render: function() {
    return(
      <Panel header={this.props.title} bsStyle="primary">
        <div id="chart" class="chart">Now Loading ...</div>
        <center><div id="switch" class="switch"></div></center>
      </Panel>
    );
  }
});

React.render(<BSPanel title="Koshian/Uzuki" />, document.getElementById("panel"));
this.chart = new google.visualization.LineChart(document.getElementById('chart'));
React.render(<BSSwitch name="switch" onColor="primary" handleWidth="50" />, document.getElementById("switch"));
