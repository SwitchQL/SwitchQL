import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import Table from './Table.jsx';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {textLeft: '', textRight: ''}
    this.updateOutput = this.updateOutput.bind(this);
  }

  updateOutput(args) {
    this.setState({textLeft: args})
  }

  render() {
    return (
      <div>
        <h1><strong>SwitchQL</strong></h1>
        <Form updateOutput={this.updateOutput} />
        <Table textLeft={this.state.textLeft} textRight={this.state.textRight}/>
      </div>
      );
    };
  };

ReactDOM.render(<App />, document.getElementById('app'));