import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.jsx';
import ZipFolder from './ZipFolder.jsx';
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
			generated: false
		};
	}

	componentDidMount() {
		console.log('mount')
		ipcRenderer.on('data', (event, args) => {
			const data = JSON.parse(args);
      this.setState(data);
		});
	}
	componentDidUpdate(){
		console.log('update')
		console.log(this.state.directory);
		document.getElementsByClassName(styles.areaOne)[0].placeholder = '';
	}

	newDatabase() {
		// document.getElementById('body').style.filter = 'brightness(40%)'
		// document.getElementById('form').style.visibility = 'visible';
		document.getElementsByClassName(styles.load)[0].classList.remove(styles.fadeOut);
		document.getElementsByClassName(styles.formvis)[0].classList.remove(styles.fadeOutScale);
		document.getElementsByClassName(styles.load)[0].classList.add(styles.fadeIn);
		document.getElementsByClassName(styles.formvis)[0].classList.add(styles.fadeInScale);
		document.getElementById('export').innerHTML = 'Export Code';
	}

	highlightClick(event) {
		const id = event.target.id;
		const tabs = document.getElementsByClassName(styles.flexTabs);
		for(let i = 0; i < tabs.length; i++){
			if(tabs[i].id !== id){
				tabs[i].style.opacity = 0.5; 
				tabs[i].style.transform = 'scale(1)'
			} else {
				tabs[i].style.opacity = 1;
				tabs[i].style.transform = 'scale(1.05)'
			}
		}
	}

	render() {
		return (
			<div>
				<div className={styles.load}></div>
				<div id='body' className={styles.vis}>
					<div className={styles.headerFont}>
					<img src={logo} className={styles.logoMain}></img>
						switch<b>QL</b>
					</div>
					<Tabs>
						<TabList>
							<div>
								<Tab className={styles.flexTabs} onClick={(event) => this.highlightClick(event)}>Type Definitions</Tab>
								<Tab className={styles.flexTabs} onClick={(event) => this.highlightClick(event)}>Client Mutations</Tab>
								<Tab className={styles.flexTabs} onClick={(event) => this.highlightClick(event)}>Client Queries</Tab>
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

				<ZipFolder/>
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
