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
        formError: { twoConnect: false, incomplete: false, emptySubmit: false }
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
      console.log(this.state)
      let urlFilled = false;
      let nonUrlFilled = false;
      let nonUrlIncomplete = false;

      for(let field in this.state){
        if(field !== 'type' && field !== 'formError'){
          if(field === 'value' && this.state[field] !== '') urlFilled = true;
          if(field !== 'value' && this.state[field] !== '') nonUrlFilled = true;
          if(field !== 'value' && this.state[field] === '') nonUrlIncomplete = true;
        }
      }
      
      if(urlFilled === true && nonUrlFilled === true) {
        this.setState({ formError: { twoConnect: true } });
      } else if(nonUrlIncomplete === true && nonUrlFilled === true) {
        this.setState({ formError: { twoConnect: false, incomplete: true } });
      } else if(urlFilled === false && nonUrlFilled === false && nonUrlIncomplete === true) {
        this.setState({ formError: { emptySubmit: true } });
      } else {
        document.getElementById('body').style.filter = 'brightness(100%)';
        document.getElementById('form').style.visibility = 'hidden';
        ipcRenderer.send('url', JSON.stringify(this.state));
        this.setState({
          value: '',
          host: '',
          port: '',
          user: '',
          password: '',
          database: '',
          type: 'PostgreSQL',
          formError: { twoConnect: false, incomplete: false, emptySubmit: false }
        });
      }
    }

    render() {
      let formError;
      if(this.state.formError.twoConnect){
        formError = <div className={styles.warning}>Please use <b>one</b> connection method.</div>
      }else if(this.state.formError.incomplete){
        formError = <div className={styles.warning}><b>*</b>These fields are required.</div>
      } else if(this.state.formError.emptySubmit){
        formError = <div className={styles.warning}>Please choose a connection method.</div>
      }
      return (
        <div className={styles.formvis} id='form'>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formIn}>
            <img src={logo} className={styles.logo}></img>
            <div className={styles.welcome}>switch<b>QL</b></div>
            <div className={styles.connect}>Connect To Your Database</div>
            <textarea placeholder="Connection String" className={styles.question} required autoComplete="off" type="text" value={this.state.value} onChange={this.handleChangeUrl} />
            
            <div className={styles.connect}>Connection String Unavailable?</div>
            <textarea placeholder="Host Name*" className={styles.question} required autoComplete="off" type="text" value={this.state.host} onChange={this.handleChangeHost} />
            <textarea placeholder="Port Number*" className={styles.question} required autoComplete="off" type="text" value={this.state.port} onChange={this.handleChangePort} />
            <textarea placeholder="User Name*" className={styles.question} required autoComplete="off" type="text" value={this.state.user} onChange={this.handleChangeUser} />
            <textarea placeholder="Password*" className={styles.question} required autoComplete="off" type="text" value={this.state.password} onChange={this.handleChangePassword} />
            <textarea placeholder="Database Name*" className={styles.question} required autoComplete="off" type="text" value={this.state.database} onChange={this.handleChangeDatabase} />
            <button type="button" className={styles.button} onClick={() => {this.handleSubmit()}}>Generate GraphQL</button>
            {formError}
            </div>
          </form>
        </div>
        );
      };
    };

