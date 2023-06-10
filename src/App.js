import React, { Component } from 'react';
import './App.css';
import Stats from './Subcomponents/Stats.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';


const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      json: {
        empty: 100,
      }
    };
  }

  componentDidMount(){
    // Sets up an event listener which reads 
    // the data set from background process
    ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
		});
    
    // ipcRenderer.on('port', e => {
    //     // port recieved, make it globally available
    //     console.log("vis renderer port end received")
    //     window.electronMessagePort = e.ports[0]
    //     window.electronMessagePort.onmessage = MessageEvent => {
    //         // handle message here
    //     }
    // })
    ipcRenderer.on('JSON_DATA', (event, args) => {
      this.setState({
        json: args,
      })
      this.setState({loading: false})
    })
  }
  
  startSim = () => {
    console.log("STARTING SIMULATION")
    ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
      string: "HELLO WORLD",
    })
    this.setState({
      loading: true,
    })
  }
 


  render () {
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row>
            <Col id="leftRow" md={5}>
              <Stats loading={this.state.loading} json={this.state.json}/>
            </Col>
            <Col id="centerRow" md={4}>
              <button id="fireSimButton" onClick={this.startSim}>Render Simulation</button>
            </Col>
            <Col id="rightRow" md={3}></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
