import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Form from "./Form.jsx";
import ZipFolder from "./ZipFolder.jsx";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styles from "./styles.csm";
import { ipcRenderer } from "electron";
import logo from "./img/logo.png";
import { Loader } from "react-loaders";
import "loaders.css/src/animations/ball-scale-ripple-multiple.scss";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: "",
      mutations: "",
      queries: "",
      isFormOpen: true,
      tabIndex: 0,
      isLoading: false
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("appError", () => {
      this.setState({ isLoading: false });
      toast.error(`Could not connect to database.
      			 Please check your connection
      			 string and try again`);
    });

    ipcRenderer.on("data", (event, args) => {
      const data = JSON.parse(args);
      this.setState({ ...data, isLoading: false });
    });
  }

  showForm() {
    this.setState({ isFormOpen: true });
  }

  hideForm() {
    this.setState({ isFormOpen: false, tabIndex: 0 });
  }

  submitForm(formData) {
    ipcRenderer.send("url", formData);
    this.setState({ isLoading: true, isFormOpen: false });
  }

  render() {
    return (
      <div>
        <div id="body" className={styles.vis}>
          <ToastContainer />

          <div
            className={
              this.state.isLoading
                ? styles.loadWrapper
                : styles.loadWrapperHidden
            }
          >
            <Loader
              active={this.state.isLoading}
              type="ball-scale-ripple-multiple"
              className={styles.loader}
              color={"#ffc1df"}
            />
          </div>

          <div className={styles.headerFont}>
            <img src={logo} className={styles.logoMain} />
            switch<b>QL</b>
          </div>

          <Tabs
            selectedIndex={this.state.tabIndex}
            onSelect={tabIndex => this.setState({ tabIndex })}
            selectedTabClassName={styles.active}
          >
            <TabList>
              <div>
                <Tab className={styles.flexTabs}>Type Definitions</Tab>
                <Tab className={styles.flexTabs}>Client Mutations</Tab>
                <Tab className={styles.flexTabs}>Client Queries</Tab>
              </div>
            </TabList>

            <TabPanel>
              <textarea
                className={styles.areaOne}
                value={this.state.schema}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className={styles.areaOne}
                value={this.state.mutations}
                readOnly
              />
            </TabPanel>
            <TabPanel>
              <textarea
                className={styles.areaOne}
                value={this.state.queries}
                readOnly
              />
            </TabPanel>
          </Tabs>

          <ZipFolder />
          <button
            type="button"
            className={styles.bottomButtons}
            onClick={() => this.showForm()}
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
