import React, { Component } from 'react';

import {Row, Col, Container} from 'react-bootstrap';
import Button from '@mui/material/Button';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Stats from './Subcomponents/Stats.js'
import Map from './Subcomponents/Map.js'
import ValueTable from './Subcomponents/ValueTable.js'
import SimArgs from './Subcomponents/SimArgs';
import Bot from "./Subcomponents/Bot"

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: '#022D36',

  }
});


const mostRecentData = require('./most_recent_data.json');
const telemetryDataJSON  = require('./telemetry_data.json');

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
      rightCol: 'stats',
      ExtraGraphs: [],
      json: {
        empty: 100,
      },
      currentValues: {
        stateOfCharge: 0,
        currentVelocity: 0
      },
      expectedValues: {
        stateOfCharge: 0,
        currentVelocity: 0
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
        console.log(event.data.message.toString())
          // handle messages here
          if (event.data.message.toString() == 'most_recent_complete') {
            this.updateRecentValues()
          }
          if(event.data.message.toString() == 'telemetry_data_queried') {
            this.processTelemetryValues()
          }
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

  requestRecentValues = () => {
    if(window.port){
      window.port.postMessage('get_most_recent');
    } else {
      console.log('No port detected!!')
    }
  }

  updateRecentValues = () => {
    const mostRecentJSON = JSON.parse(mostRecentData)
    if (mostRecentJSON) {
      this.setState({
        currentValues: {
          currentVelocity: mostRecentJSON['vehicle_velocity']['value'],
          stateOfCharge: mostRecentJSON['state_of_charge']['value']
        }
      });
    }
  }

  processTelemetryValues = () => {
    const telemetryData = JSON.parse(telemetryDataJSON);
    console.log(telemetryData);
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

  handleChangeSelect = (e) => {
    const {
      target: { value },
    } = e;
    this.setState({
      ExtraGraphs: typeof value === 'string' ? value.split(',') : value,
    });
    console.log(typeof value === 'string' ? value.split(',') : value,);
  }


  render () {
    const controlRightCol = {
      value: this.state.rightCol,
      onChange: (e) => {
        if(this.state.rightCol === 'stats') {
          this.setState({rightCol:'map'})
        } else {
          this.setState({rightCol: 'stats'})
        }
      },
      exclusive: true,
    };

    const statProvider = () => {
      if(this.state.rightCol === 'stats'){
        return(
          <Stats 
            loading={this.state.loading} 
            json={this.state.json} 
            handleChange={this.handleChangeSelect}
            Select={this.state.ExtraGraphs}
          />
        );
      } else {
        return( <Map granularity={this.state.mapGranularity} display={this.state.displayMap} json={this.state.json} />);
      }
    }
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row id='appRow'>
            <Col id="leftRow" xl={4}>
              <Row>
                <Col>
                  <Button id="fireSimButton" onClick={this.startSim} variant="contained" size="large">Run Simulation</Button>
                </Col>
                <Col>
                  <ToggleButtonGroup id="toggleStats" {...controlRightCol}> 
                    <ToggleButton value="stats"><div style={{color: 'white', 'width':'100px'}}>Graphs</div></ToggleButton>
                    <ToggleButton value="map"><div style={{color: 'white', 'width':'100px'}}>Map</div></ToggleButton>
                  </ToggleButtonGroup>
                </Col>
              </Row>
              
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
              <ValueTable 
                currentValues={this.state.currentValues} 
                expectedValues={this.state.expectedValues} 
                sendMostRecentMessage={this.requestRecentValues} 
              />
            </Col>
            <Col id="rightRow" xl={8}>
             {statProvider()}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;