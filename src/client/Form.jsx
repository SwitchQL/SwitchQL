import React, { Component } from 'react';
import styles from "./styles.css";

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
      fetch('http://localhost:3000/getInfo', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({url: this.state.value}),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
    }

    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <textarea placeholder="Input URL Here..." className={styles.question} required autoComplete="off" type="text" value={this.state.value} onChange={this.handleChange} />
            <label></label>
            <input className={styles.submitButton} type="submit" value="Submit" />
          </form>
        </div>
        );
      }
    }

