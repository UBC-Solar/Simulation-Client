# Simulation-Client

This is the front-end side of the simulation application. The goal of this application is to create a local user-interface to host the simulation. We envision the final product will be capable of pulling telemetry data from a database and will allow the user to manually prompt the simulation to re-calculate as needed. It is built using a combination of Electron and React, and uses hidden windows to launch a python sub-processes where simulation data is calculated.

### Prerequisites ###

Python 3.8 or above (https://www.python.org/downloads/)

Git version control (https://git-scm.com/downloads)

nodejs (https://nodejs.org/en/download/)

### Getting Started ###

Clone this repository and switch to the electron branch.

```bash
git clone https://github.com/UBC-Solar/Simulation-Client.git

git checkout electron
```

Install node modules
```bash
npm install
```
To start the application run the command

```bash
npm start
```


### General Architechture ###

This application consists of three main parts. The first one is the main process, which sends commands and passes information between the other two subprocesses. 
The majority of the code for the main process is found /public/electron.js

The second process is the visible renderer. It creates and rendered components. This is where the react.js portion of the applicaiton lives. Data that needs to be displayed in the user interface must be passed to the visible render from the main process. If you aren't familiar with react, read about components here. (https://reactjs.org). 
The code for the visible renderer process mostly lives in the src folder (primarily /src/App.js).

The final process is the hidden renderer. When prompted by the main process, it launches a python script using the python-shell node module. It waits for the script to finish computing and returns data to the main process. 
The hidden process window ( an instance of electron's BrowserWindow ) is created in /public/electron.js. 
The background_task folder contains html files that are responsible for launching the python scripts loced in the /scripts folder.
