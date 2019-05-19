import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Form from "./Form.jsx";
import ZipFolder from "./ZipFolder.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./styles/main.css";
import { ipcRenderer } from "electron";
import logo from "./img/logo.png";
import { Loader } from "react-loaders";
import "loaders.css/src/animations/ball-scale-ripple-multiple.scss";
import * as events from "../server/events";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: "",
      mutations: "",
      queries: "",
      isFormOpen: true,
      tabIndex: 0,
      isLoading: false,
      exportDisabled: true,
      formDisabled: false
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.onExport = this.onExport.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(events.APP_ERROR, () => {
      this.setState(prev => ({
        isLoading: false,
        formDisabled: false,
        exportDisabled: !(prev.schema && prev.mutations && prev.queries)
      }));
      toast.error(`Could not connect to database.
      			 Please check your connection
      			 string and try again`);
    });

    ipcRenderer.on(events.DATA, (event, args) => {
      const data = JSON.parse(args);
      this.setState({
        ...data,
        isLoading: false,
        exportDisabled: false,
        formDisabled: false
      });
    });

    ipcRenderer.on(events.EXPORT_SUCCESS, () => {
      this.setState({
        isLoading: false,
        exportDisabled: false,
        formDisabled: false
      });
      toast.success("Successfully Exported Code");
    });
  }

  showForm() {
    this.setState({ isFormOpen: true });
  }

  hideForm() {
    this.setState({ isFormOpen: false, tabIndex: 0 });
  }

  submitForm(formData) {
    ipcRenderer.send(events.URL, formData);
    this.setState({
      isLoading: true,
      isFormOpen: false,
      formDisabled: true,
      exportDisabled: true
    });
  }

  onExport(path) {
    ipcRenderer.send(events.DIRECTORY, path);
    this.setState({
      isLoading: true,
      formDisabled: true,
      exportDisabled: true
    });
  }

  render() {
    return (
      <div>
        <div id="body" className="vis">
          <ToastContainer />

          <div
            className={
              this.state.isLoading ? "loadWrapper" : "loadWrapperHidden"
            }
          >
            <Loader
              active={this.state.isLoading}
              type="ball-scale-ripple-multiple"
              className="loader"
              color={"#ffc1df"}
            />
          </div>

          <div className="headerFont">
            <img src={logo} className="logoMain" />
            switch<b>QL</b>
          </div>

          <Tabs
            selectedIndex={this.state.tabIndex}
            onSelect={tabIndex => this.setState({ tabIndex })}
            selectedTabClassName="active"
          >
            <TabList>
              <div>
                <Tab className="flexTabs">Type Definitions</Tab>
                <Tab className="flexTabs">Client Mutations</Tab>
                <Tab className="flexTabs">Client Queries</Tab>
              </div>
            </TabList>

            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.schema}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.mutations}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className="areaOne"
                value={this.state.queries}
                readOnly
              />
            </TabPanel>
          </Tabs>

          <ZipFolder
            onExport={this.onExport}
            disabled={this.state.exportDisabled}
          />

          <button
            type="button"
            className="bottomButtons"
            onClick={() => this.showForm()}
            disabled={this.state.formDisabled}
          >
            New Database
          </button>
        </div>

        <Form
          updateSchema={this.updateSchema}
          updateMutations={this.updateMutations}
          updateQueries={this.updateQueries}
          onClose={this.hideForm}
          onSubmit={this.submitForm}
          isOpen={this.state.isFormOpen}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
