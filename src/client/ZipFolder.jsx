import React, { Component } from "react";
import { ipcRenderer } from "electron";
import styles from "./styles.csm";

class ZipFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.files[0].path });
  }

  componentDidUpdate() {
    if (this.state.value) {
      document.getElementById("export").innerHTML = "Export Complete!";
      ipcRenderer.send("directory", this.state.value);
      this.setState({ value: "" });
    }
  }

  render() {
    return (
      <div>
        <input
          className={styles.inputVis}
          id="input"
          type="file"
          webkitdirectory={1}
          onChange={this.handleChange}
        />
        <label htmlFor="input" id="export" className={styles.bottomButtons}>
          Export Code
        </label>
      </div>
    );
  }
}
export default ZipFolder;
