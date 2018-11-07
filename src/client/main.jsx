import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import Table from './Table.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <h1><strong>SwitchQL</strong></h1>
        <Form />
        <Table />
      </div>
      );
    };
  };

ReactDOM.render(<App />, document.getElementById('app'));