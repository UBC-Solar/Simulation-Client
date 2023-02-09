import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const electron = window.require('electron');
const { ipcRenderer } = electron;


class App extends Component {

  componentDidMount(){

    ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
			console.log(args);
		});

    ipcRenderer.send('VISIBLE_START', {
      number: 100,
    })
  }

  render (){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
