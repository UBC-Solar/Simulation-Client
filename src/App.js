import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			number: 0
		}
	}

	componentDidMount() {
		// setting up an event listener to read data that background process
		// will send via the main process after processing the data we
		// send from visiable renderer process
		ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
			this.setState({
				number: args,
			})
		});

		// trigger event to start background process
		// can be triggered pretty much from anywhere after
		// you have set up a listener to get the information
		// back from background process, as I have done in line 13
		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
			number: 5,
		});
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<Container id="mainContainer" fluid>
						<div>{this.state.number}</div>
						<Row>
							<Col md={8} id="mapCol">Map</Col>
							<Col md={4} id="statCol">Stats</Col>
						</Row>
					</Container>
				</header>
			</div>
		);
	}
}

export default App;