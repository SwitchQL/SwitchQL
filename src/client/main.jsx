import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './styles.css';
import { ipcRenderer } from 'electron';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currTab: 'schema',
			schema: '',
			mutations: '',
			queries: ''
		};
	}

	componentDidMount() {
		ipcRenderer.on('data', (event, args) => {
			const data = JSON.parse(args);
			this.setState(data);
		});
	}

	render() {
		return (
			<div>
				<h1>
					<strong>SwitchQL</strong>
				</h1>
				<Form
					updateSchema={this.updateSchema}
					updateMutations={this.updateMutations}
					updateQueries={this.updateQueries}
				/>
				<Tabs>
					<TabList>
						<div className={styles.flexTabs}>
							<Tab>Schema</Tab>
							<Tab>Client Mutations</Tab>
							<Tab>Client Queries</Tab>
						</div>
					</TabList>

					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
								<textarea className={styles.areaOne} value={this.state.schema} readOnly />
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
								<textarea className={styles.areaOne} value={this.state.mutations} readOnly />
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div className={styles.tableText}>
							<div className={styles.areaOneBox}>
								<textarea className={styles.areaOne} value={this.state.queries} readOnly />
							</div>
						</div>
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
