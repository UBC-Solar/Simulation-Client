import React, { Component } from 'react';
import './App.css';
import Stats from './Subcomponents/Stats.js'
import Map from './Subcomponents/Map.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';

import Slider from '@mui/material/Slider';


const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      diplayMap: false,
      json: {
        empty: 100,
      },
      granularity: 15,
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
      this.setState({
        loading: false,
        displayMap: false
      })
    })
  }
  
  startSim = () => {
    console.log("STARTING SIMULATION")
    ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
      string: "HELLO WORLD",
    })
    this.setState({
      loading: true,
      displayMap: false,
    })
  }
 


  render () {
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row id='appRow'>
            <Col id="leftRow" md={5}>
              <Stats loading={this.state.loading} json={this.state.json}/>
            </Col>
            <Col id="centerRow">
              <button id="fireSimButton" onClick={this.startSim}>Render Simulation</button>
              <Slider 
                marks={true}
                min={15}
                max={90}
                step={15}
                defaultValue={this.granularity}
                onChange={(e) => this.setState({granularity: e.target.value})}
                valueLabelDisplay="auto"
              />
            </Col>
            <Col id="rightRow" md={6}>
              <Map granularity={this.state.granularity} display={this.state.display} coordinates={this.state.json['GIS_coordinates']} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
