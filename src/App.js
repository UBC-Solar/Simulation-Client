import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';


const electron = window.require('electron');
const { ipcRenderer } = electron;




class App extends Component {

  componentDidMount(){
    // Sets up an event listener which reads 
    // the data set from background process
    ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
		});
  }
  
  startSim() {
    console.log("STARTING SIMULATION")
    ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
      string: "HELLO WORLD",
    })
  }
 


  render () {
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row>
            <Col id="leftRow">
            </Col>
            <Col md={5} id="centerRow">
              <button id="fireSimButton" onClick={this.startSim}>Render Simulation</button>
            </Col>
            <Col id="rightRow"></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
