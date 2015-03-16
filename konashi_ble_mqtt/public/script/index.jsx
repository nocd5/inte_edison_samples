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

React.render(<JumbotronBox text="Intel Edison" />, document.getElementById("header"));
React.render(<MyButton/>, document.getElementById("button"));

