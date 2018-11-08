import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import Table from './Table.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './styles.css';
const { ipcRenderer } = require('electron');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currTab: 'schema',
			schema: '',
			mutations: '',
			queries: ''
		};
		// this.updateOutput = this.updateOutput.bind(this);
	}

	// updateOutput(args) {
	//   this.setState({textLeft: args})
	// }

	updateSchema(args) {
		this.setState({ schema: args });
	}

	updateMutations(args) {
		this.setState({ mutations: args });
	}

	updateQueries(args) {
		this.setState({ queries: args });
	}

	updateTabToSchema() {
		this.setState({ currTab: 'schema' });
	}

	updateTabToQueries() {
		this.setState({ currTab: 'queries' });
	}

	updateTabToMutations() {
		this.setState({ currTab: 'mutations' });
  }
  componentDidMount() {
    ipcRenderer.on('testback', (event, args) => {
      // const dataobj = JSON.parse(args);
      // console.log(args);
      this.setState({schema: args})
    });
  }

	render() {
		// let currentRender;
		// switch (this.state.currTab) {
		// 	case 'schema':
		// 		currentRender = <Table schema={this.state.schema} />;
		// 	case 'queries':
		// 		currentRender = <Table schema={this.state.queries} />;
		// 	case 'mutations':
		// 		currentRender = <Table schema={this.state.mutations} />;
		// }

		return (
			<div>
				<h1>
					<strong>SwitchQL</strong>
				</h1>
				<Form />
				<Tabs>
					<TabList>
            <div className={styles.flexTabs}>
              <Tab>Schema</Tab>
              <Tab>Queries</Tab>
              <Tab>Mutations</Tab>
            </div>
					</TabList>

					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
							<textarea className={styles.areaOne} readOnly value={this.state.schema}/>
						</div>
            </div>
					</TabPanel>
					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
							<textarea className={styles.areaOne} readOnly value='2'/>
						</div>
            </div>
					</TabPanel>
					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
							<textarea className={styles.areaOne} readOnly value='3'/>
						</div>
            </div>
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
