var Button = ReactBootstrap.Button;
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
React.render(<BSSwitch name="switch" onColor="primary" handleWidth="50" />, document.getElementById("switch"));

