import React, { Component } from 'react';

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
      fetch('/getInfo'), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(this.state.value),
      }
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

