import React, { Component } from "react";
import styles from "./styles.csm";
import logo from "./img/logo.png";
import icon from "./img/icon.png";
const { ipcRenderer } = require("electron");

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

    ipcRenderer.send("url", JSON.stringify(this.state));

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

    this.prop;
    this.props.onSubmit();
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
        <div className={styles.warning}>
          Please use <b>one</b> connection method.
        </div>
      );
    } else if (this.state.formError.incomplete) {
      formError = (
        <div className={styles.warning}>
          <b>*</b>These fields are required.
        </div>
      );
    } else if (this.state.formError.emptySubmit) {
      formError = (
        <div className={styles.warning}>Please choose a connection method.</div>
      );
    }

    const classList = this.props.isOpen
      ? `${styles.formvis} ${styles.fadeInScale}`
      : `${styles.formvis} ${styles.fadeOutScale}`;

    return (
      <div className={classList} id="form">
        <form onSubmit={this.submit}>
          <div className={styles.formIn}>
            <a
              href="https://github.com/SwitchQL/SwitchQL/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={icon} className={styles.icon} />
            </a>
            <img src={logo} className={styles.logo} />
            <div className={styles.welcome}>
              switch<b>QL</b>
            </div>
            <div className={styles.connect}>Connect To Your Database</div>
            <textarea
              placeholder="Connection String"
              name="value"
              className={styles.question}
              required
              autoComplete="off"
              type="text"
              value={this.state.value}
              onChange={this.valueChange}
            />

            <div className={styles.connect}>Connection String Unavailable?</div>
            <textarea
              placeholder="Host Name*"
              name="host"
              className={styles.question}
              required
              autoComplete="off"
              type="text"
              value={this.state.host}
              onChange={this.valueChange}
            />
            <textarea
              placeholder="Port Number*"
              name="port"
              className={styles.question}
              required
              autoComplete="off"
              type="text"
              value={this.state.port}
              onChange={this.valueChange}
            />
            <textarea
              placeholder="User Name*"
              name="user"
              className={styles.question}
              required
              autoComplete="off"
              type="text"
              value={this.state.user}
              onChange={this.valueChange}
            />
            <input
              placeholder="Password*"
              name="password"
              className={styles.question}
              required
              autoComplete="off"
              type="password"
              value={this.state.password}
              onChange={this.valueChange}
            />
            <textarea
              placeholder="Database Name*"
              name="database"
              className={styles.question}
              required
              autoComplete="off"
              type="text"
              value={this.state.database}
              onChange={this.valueChange}
            />
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                this.submit();
              }}
            >
              Generate GraphQL
            </button>
            <button
              type="button"
              className={styles.exit}
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
