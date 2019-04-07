import React, { Component } from "react";
import "./styles/zip.css";

class ZipFolder extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.resetValue = this.resetValue.bind(this);
    this.input = React.createRef();
  }

  submit(e) {
    const path = this.input.current.files[0]
      ? this.input.current.files[0].path
      : null;

    if (path) {
      this.props.onExport(path);
    }
    e.stopPropagation();
  }

  /* 
    Necessary to fix bug where the same folder cannot be selected more 
    than once in a row.
  */
  resetValue(e) {
    e.target.value = null;
  }

  render() {
    return (
      <div onChange={this.submit} onClick={this.resetValue}>
        <input
          className="inputVis"
          type="file"
          id="input"
          webkitdirectory={1}
          ref={this.input}
          disabled={this.props.disabled}
        />

        <label
          htmlFor="input"
          className={
            this.props.disabled ? `bottomButtons btnDisabled` : "bottomButtons"
          }
        >
          Export Code
        </label>
      </div>
    );
  }
}
export default ZipFolder;
