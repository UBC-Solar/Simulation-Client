import React, { Component } from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Container} from 'react-bootstrap';


const electron = window.require('electron');
const { ipcRenderer } = electron;





class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    ipcRenderer.on('JSON_DATA', (event, args) => {
      this.setState({
        json: args,
      })
    })
  }
  
  startSim() {
    console.log("STARTING SIMULATION")
    ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
      string: "HELLO WORLD",
    })
  }
 


  render () {
    let returnString = "";
    if (this.state.json["empty"] === undefined){
      this.state.json["distances"].forEach(element => {
        returnString += element + "\n"
      });
    } else {
      returnString = "NO DATA..."
    }
    
    return (
      <div className="App">
        <Container fluid id="appContainer">
          <Row>
            <Col id="leftRow">
              <div>{returnString}</div>
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
