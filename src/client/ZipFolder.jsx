import React, { Component } from "react";
import "./styles/zip.css";

class ZipFolder extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
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

  render() {
    return (
      <div onChange={this.submit}>
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
