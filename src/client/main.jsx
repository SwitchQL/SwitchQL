import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <Form />
      </div>
      );
    }
  }



ReactDOM.render(<App />, document.getElementById('app'));