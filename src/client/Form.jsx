import React, { Component } from 'react';
import styles from "./styles.css";
const { ipcRenderer } = require('electron');

export default class Form extends Component {
    constructor(props) {
      super(props)
      this.state = {
        value: '',
        host: '',
        port: '',
        user: '',
        password: '',
        database: '',
        type: 'PostgreSQL',
    }
      this.handleChangeUrl = this.handleChangeUrl.bind(this);
      this.handleChangeHost = this.handleChangeHost.bind(this);
      this.handleChangePort = this.handleChangePort.bind(this);
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleChangePassword = this.handleChangePassword.bind(this);
      this.handleChangeDatabase = this.handleChangeDatabase.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUrl(event) {
      this.setState({value: event.target.value});
    }

    handleChangeHost(event) {
      this.setState({host: event.target.value});
    }

    handleChangePort(event) {
      this.setState({port: event.target.value});
    }

    handleChangeUser(event) {
      this.setState({user: event.target.value});
    }

    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }

    handleChangeDatabase(event) {
      this.setState({database: event.target.value});
    }


    handleSubmit() {
      event.preventDefault();
      ipcRenderer.send('url', JSON.stringify(this.state));
    }

    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <textarea placeholder="Input Connection String Here..." className={styles.question} required autoComplete="off" type="text" value={this.state.value} onChange={this.handleChangeUrl} />
            <h3>OR...</h3>
            <textarea placeholder="Input Host Name" className={styles.question} required autoComplete="off" type="text" value={this.state.host} onChange={this.handleChangeHost} />
            <textarea placeholder="Input Port Number" className={styles.question} required autoComplete="off" type="text" value={this.state.port} onChange={this.handleChangePort} />
            <textarea placeholder="Input User Name" className={styles.question} required autoComplete="off" type="text" value={this.state.user} onChange={this.handleChangeUser} />
            <textarea placeholder="Input Password" className={styles.question} required autoComplete="off" type="text" value={this.state.password} onChange={this.handleChangePassword} />
            <textarea placeholder="Input Database Name" className={styles.question} required autoComplete="off" type="text" value={this.state.database} onChange={this.handleChangeDatabase} />
            <label></label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        );
      };
    };

