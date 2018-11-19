import React, { Component } from 'react';
import styles from "./styles.css";
import logo from './img/logo.png';
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
      console.log(this.state.host)
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
      console.log('sending data');
    }

    toggleBright() {
      console.log(this.state)
      document.getElementById('body').style.filter = 'brightness(100%)'

      let form = document.getElementById('form');
      form.style.visibility = 'hidden';
    }

    render() {
      return (
        <div className={styles.formvis} id='form'>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formIn}>
            <img src={logo} className={styles.logo}></img>
            <div className={styles.welcome}>switch<b>QL</b></div>
            <div className={styles.connect}>Connect To Your Database</div>
            <textarea placeholder="Connection String" className={styles.question} required autoComplete="off" type="text" value={this.state.value} onChange={this.handleChangeUrl} />
            
            <div className={styles.connect}>Connection String Unavailable?</div>
            <textarea placeholder="Host Name" className={styles.question} required autoComplete="off" type="text" value={this.state.host} onChange={this.handleChangeHost} />
            <textarea placeholder="Port Number" className={styles.question} required autoComplete="off" type="text" value={this.state.port} onChange={this.handleChangePort} />
            <textarea placeholder="User Name" className={styles.question} required autoComplete="off" type="text" value={this.state.user} onChange={this.handleChangeUser} />
            <textarea placeholder="Password" className={styles.question} required autoComplete="off" type="text" value={this.state.password} onChange={this.handleChangePassword} />
            <textarea placeholder="Database Name" className={styles.question} required autoComplete="off" type="text" value={this.state.database} onChange={this.handleChangeDatabase} />
            <button type="button" className={styles.button} onClick={() => {
              this.toggleBright()
              this.handleSubmit()
              }}>Generate GraphQL</button>
            <div className={styles.warning} id='warning'><b>*</b>Please input <b>one</b> connection method</div>
            </div>
          </form>
        </div>
        );
      };
    };

