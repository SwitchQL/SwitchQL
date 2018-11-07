import React, { Component } from 'react';
const { ipcRenderer } = require('electron');

export default class Form extends Component {
    constructor(props) {
      super(props)
      this.state = {value: ''}
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
      this.setState({value: event.target.value});
    }

    handleSubmit() {
      event.preventDefault();
      ipcRenderer.send('url', this.state.value);
    }

    componentDidMount() {
      ipcRenderer.on('testback', (event, args) => {
        // const dataobj = JSON.parse(args);
        console.log(args);
      });
    }
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              URL:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
              <input type="submit" value="Submit" />
        </form>
    </div>
        );
      }
    }

