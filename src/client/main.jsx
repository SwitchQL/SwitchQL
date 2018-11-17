import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './styles.css';
import { ipcRenderer } from 'electron';
import logo from './img/logo.png';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currTab: 'schema',
			schema: '',
			mutations: '',
			queries: '',
			dbConnected: false,
		};
	}

	componentDidMount() {
		ipcRenderer.on('data', (event, args) => {
			const data = JSON.parse(args);
      this.setState(data);
		});
	}

	toggleBright() {
		document.getElementById('body').style.filter = 'brightness(40%)'

		let form = document.getElementById('form');
		form.style.visibility = 'visible';
	}

	render() {
		return (
			<div>
				<div id='body' className={styles.vis}>
					<div className={styles.headerFont}>
					<img src={logo} className={styles.logoMain}></img>
					{/* <img src={logo} className={styles.logo}></img> */}
						switch<b>QL</b>
					</div>
					<Tabs>
						<TabList>
							<div className={styles.flexTabs}>
								<Tab>Schema</Tab>
								<Tab>Client Mutations</Tab>
								<Tab>Client Queries</Tab>
							</div>
						</TabList>

						<TabPanel>
							<textarea className={styles.areaOne} value={this.state.schema} readOnly />
						</TabPanel>
						<TabPanel>
							<textarea className={styles.areaOne} value={this.state.mutations} readOnly />
						</TabPanel>
						<TabPanel>
							<textarea className={styles.areaOne} value={this.state.queries} readOnly />
						</TabPanel>
					</Tabs>
				<button type='button' className={styles.bottomButtons}>Export Code</button>
				<button type='button' className={styles.bottomButtons} onClick={() => this.toggleBright()} >New Database</button>
				</div>
				<Form
					updateSchema={this.updateSchema}
					updateMutations={this.updateMutations}
					updateQueries={this.updateQueries}
				/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
