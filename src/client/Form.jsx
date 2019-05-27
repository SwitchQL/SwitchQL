//node libraries
import React, { Component } from "react";

//internal files
import "./styles/form.css";
import logo from "./img/logo.png";
import icon from "./img/icon.png";

const databaseTypes = ["PostgreSQL", "MySQL", "SQLServer"];

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      host: "",
      port: "",
      user: "",
      password: "",
      database: "",
      type: "PostgreSQL",
      formError: { twoConnect: false, incomplete: false, emptySubmit: false }
    };

    this.valueChange = this.valueChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  valueChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  submit() {
    event.preventDefault();
    if (!this.isFormValid()) return false;

    this.props.onSubmit(JSON.stringify(this.state));

    this.setState({
      value: "",
      host: "",
      port: "",
      user: "",
      password: "",
      database: "",
      type: "PostgreSQL",
      formError: { twoConnect: false, incomplete: false, emptySubmit: false }
    });
  }

  isFormValid() {
    let urlFilled = false;
    let nonUrlFilled = false;
    let nonUrlIncomplete = false;

    for (let field in this.state) {
      if (field !== "type" && field !== "formError") {
        if (field === "value" && this.state[field] !== "") urlFilled = true;
        if (field !== "value" && this.state[field] !== "") nonUrlFilled = true;
        if (field !== "value" && this.state[field] === "")
          nonUrlIncomplete = true;
      }
    }

    if (urlFilled === true && nonUrlFilled === true) {
      this.setState({ formError: { twoConnect: true } });
      return false;
    }

    if (nonUrlIncomplete === true && nonUrlFilled === true) {
      this.setState({ formError: { twoConnect: false, incomplete: true } });
      return false;
    }

    if (
      urlFilled === false &&
      nonUrlFilled === false &&
      nonUrlIncomplete === true
    ) {
      this.setState({ formError: { emptySubmit: true } });
      return false;
    }

    return true;
  }

  render() {
    let formError;

    if (this.state.formError.twoConnect) {
      formError = (
        <div className="warning">
          Please use <b>one</b> connection method.
        </div>
      );
    } else if (this.state.formError.incomplete) {
      formError = (
        <div className="warning">
          <b>*</b>These fields are required.
        </div>
      );
    } else if (this.state.formError.emptySubmit) {
      formError = (
        <div className="warning">Please choose a connection method.</div>
      );
    }

    const classList = this.props.isOpen
      ? `formvis fadeInScale`
      : `formvis fadeOutScale`;

    return (
      <div className={classList}>
        <form onSubmit={this.submit}>
          <div className="formIn">
            <a
              href="https://github.com/SwitchQL/SwitchQL/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={icon} className="icon" />
            </a>
            <img src={logo} className="logo" />
            <div className="welcome">
              switch<b>QL</b>
            </div>

            <div className="radioWrapper">
              {databaseTypes.map((n, i) => {
                return (
                  <label key={i} className="radioBtn">
                    <input
                      type="radio"
                      name="type"
                      value={n}
                      checked={this.state.type === n}
                      onChange={this.valueChange}
                      disabled
                    />
                    {n}
                  </label>
                );
              })}
            </div>

            <div className="connect">Connect To Your Database</div>
            <textarea
              placeholder="Connection String"
              name="value"
              className="question"
              required
              autoComplete="off"
              type="text"
              value={this.state.value}
              onChange={this.valueChange}
            />

            <div className="connect">Connection String Unavailable?</div>
            <textarea
              placeholder="Host Name*"
              name="host"
              className="question"
              required
              autoComplete="off"
              type="text"
              value={this.state.host}
              onChange={this.valueChange}
            />

            <textarea
              placeholder="Port Number*"
              name="port"
              className="question"
              required
              autoComplete="off"
              type="text"
              value={this.state.port}
              onChange={this.valueChange}
            />

            <textarea
              placeholder="User Name*"
              name="user"
              className="question"
              required
              autoComplete="off"
              type="text"
              value={this.state.user}
              onChange={this.valueChange}
            />

            <input
              placeholder="Password*"
              name="password"
              className="question"
              required
              autoComplete="off"
              type="password"
              value={this.state.password}
              onChange={this.valueChange}
            />

            <textarea
              placeholder="Database Name*"
              name="database"
              className="question"
              required
              autoComplete="off"
              type="text"
              value={this.state.database}
              onChange={this.valueChange}
            />

            <button
              type="button"
              className="button"
              onClick={() => {
                this.submit();
              }}
            >
              Generate GraphQL
            </button>

            <button
              type="button"
              className="exit"
              onClick={() => this.props.onClose()}
            >
              ×
            </button>
            {formError}
          </div>
        </form>
      </div>
    );
  }
}
