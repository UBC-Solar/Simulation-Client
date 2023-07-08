import React, { Component } from 'react';

import {Row, Col, Container} from 'react-bootstrap';
import Button from '@mui/material/Button';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Stats from './Subcomponents/Stats.js'
import Map from './Subcomponents/Map.js'
import SimArgs from './Subcomponents/SimArgs';





const electron = window.require('electron');
const { ipcRenderer } = electron;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      diplayMap: false,
      hasStartedBackground: false,
      mapGranularity: 90,
      json: {
        empty: 100,
      },
      simArgs: {
        granularity: 10,
        golang: "true",
        optimize: "timeTaken",
      },
    };
  }

  componentDidMount(){
    // Sets up an event listener which reads 
    // the data set from background process
    ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
		});
    
    ipcRenderer.on('port', e => {
      // port recieved, make it globally available
      console.log("vis renderer port end received")
      window.port = e.ports[0]
      window.port.onmessage = (event) => {
        console.log(event.data)
          // handle message here
      }
      window.port.start()
    })

    if (!this.hasStartedBackground){
      ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
        string: "HELLO WORLD",
      })
      this.setState({ hasStartedBackground: true })
    }

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
    console.log("RE-RUNNING SIMULATION")
    window.port.postMessage('run_sim')
    this.setState({
      loading: true,
      displayMap: false,
    })
  }

  handleChangeGo = (e, value) => {
    if(value) {
      const args = this.state.simArgs;
      args.golang = value;
      this.setState({simArgs: args});
    }
  }
  handleChangeOptimize = (e, value) => {
    if(value) {
      const args = this.state.simArgs;
      args.optimize = value;
      this.setState({simArgs: args});
    }
  }

  render () {
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row id='appRow'>
            <Col id="leftRow" xl={4}>
              <Stats loading={this.state.loading} json={this.state.json}/>
            </Col>
            <Col id="centerRow" xl={2}>
              <Button id="fireSimButton" onClick={this.startSim} variant="contained" size="large">Run Simulation</Button>
              <SimArgs 
                mapGran={this.state.mapGranularity} 
                args={this.state.simArgs} 
                commitChangeMap={(e, val) => this.setState({mapGranularity: val})}
                commitChangeSim={(e, val) => {
                  let newArgs = this.state.simArgs;
                  newArgs.granularity = val;
                  this.setState({simArgs: newArgs});
                }}
                handleChanges={[this.handleChangeGo, this.handleChangeOptimize]}
              />
            </Col>
            <Col id="rightRow" xl={6}>
              <Map granularity={this.state.mapGranularity} display={this.state.displayMap} json={this.state.json} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;