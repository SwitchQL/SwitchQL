import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './styles.css';
import { ipcRenderer } from 'electron';
import logo from './img/logo.png';

const fs = require('fs');
const JSZip = require('jszip');
const path = require('path');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currTab: 'schema',
			schema: '',
			mutations: '',
			queries: ''
		};
		this.createZip = this.createZip.bind(this);
	}

	componentDidMount() {
		ipcRenderer.on('data', (event, args) => {
			const data = JSON.parse(args);
      this.setState(data);
		});
	}

	newDatabase() {
		document.getElementById('body').style.filter = 'brightness(40%)'
		document.getElementById('form').style.visibility = 'visible';
	}


	createZip(e) {
		let directory = e.target.files;
		console.log(directory)
		const zip = new JSZip();
		zip.file("Schema.js", this.state.schema);
		zip.file("clientMutations.js", this.state.mutations);
		zip.file("clientQueries.js", this.state.queries);
		// zip
		// 	.generateNodeStream({type:'nodebuffer',streamFiles:true})
		// 	.pipe(fs.createWriteStream(path.join(directory,'SwitchQL.zip')))
		// 	.on('finish', function () {
		// 	// JSZip generates a readable stream with a "end" event,
		// 	// but is piped here in a writable stream which emits a "finish" event.
		// 		event.sender.send('Confirmed ZIP', 'Finished!')
		// });
	}

	render() {
		return (
			<div>
				<div id='body' className={styles.vis}>
					<div className={styles.headerFont}>
					<img src={logo} className={styles.logoMain}></img>
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
				<button type='button' className={styles.bottomButtons} onClick={(event) => this.createZip(event)}>Export Code</button>
				{/* <input type='file' webkitdirectory={1} className={styles.bottomButtons} onClick={(event) => this.createZip(event)}></input> */}
				<button type='button' className={styles.bottomButtons} onClick={() => this.newDatabase()} >New Database</button>
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
