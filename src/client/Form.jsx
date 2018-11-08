import React, { Component } from 'react';
import styles from "./styles.css";
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
        // console.log(args);
        this.props.updateOutput(args)
      });
    }
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <textarea placeholder="Input URL Here..." className={styles.question} required autoComplete="off" type="text" value={this.state.value} onChange={this.handleChange} />
            <label></label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        );
      };
    };

