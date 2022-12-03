import React, { useState } from "react";

var client = require('websocket').client;
var W3CWebSocket = require('websocket').w3cwebsocket;


function  App() {
  
  const [messageData, setMessages] = useState('');

  const ws = new W3CWebSocket('ws://127.0.0.1:8000/ws/server/');

  ws.onopen = (event) => {
    console.log("connected");
  };

  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    setMessages(json.message);
    console.log(json.message);

  };

  return (<div>{messageData}</div>);
}

export default  App;