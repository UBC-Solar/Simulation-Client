const electron = require('electron');
const path = require('path');
const url = require('url');

const { app } = electron;
const { BrowserWindow } = electron;

const { ipcMain, MessageChannelMain } = require('electron');

// Initialize ports for communication b/w hidden and main renderer
const { port1, port2 } = new MessageChannelMain()
const simDataJSON = require('../data.json');

let mainWindow;

function createWindow() {
	const startUrl = process.env.DEV
		? 'http://localhost:3000'
		: url.format({
				pathname: path.join(__dirname, '/../build/index.html'),
				protocol: 'file:',
				slashes: true,
		  });
	
    mainWindow = new BrowserWindow({
		width: 2000,
		height: 900,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
		}
	});

	mainWindow.loadURL(startUrl);
	process.env.DEV && mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	// Once window is ready - hand it the associated port
	mainWindow.once('ready-to-show', () => {
		console.log("Sending port to visible renderer from main")
		mainWindow.webContents.postMessage('port', null, [port1])
	})
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
	console.log("Booting in activate")
    createWindow();
  }
});

// ------------------- event listeners here --------------------

// tmp variable to store data until background is ready to process
let cache = {
	data: undefined,
};

// set up window outside function scope to ensure it is not garbage collected
let hiddenWindow;

// This listens for the command to start background
// and starts the background/hidden renderer
ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {
	// This catches when the visible renderer attemps to boot another hidden renderer, when one is already running
	if (hiddenWindow){
		console.log("Background window already exists");
		return;
	}
	console.log("Starting background via main")
	const backgroundFileUrl = url.format({
		pathname: path.join(__dirname, '../background_tasks/background.html'),
		protocol: 'file:',
		slashes: true,
	});
	hiddenWindow = new BrowserWindow({
		show: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		},
	});
	hiddenWindow.loadURL(backgroundFileUrl);

	hiddenWindow.webContents.openDevTools();

	hiddenWindow.on('closed', ()=> {
		hiddenWindow = null;
	});

	cache.data = args.number;

	// Once window is ready - hand it the associated port
	hiddenWindow.once('ready-to-show', () => {
		console.log("Sending port to hidden window from main")
		hiddenWindow.webContents.postMessage('port', null, [port2])
	})
});

// This event listener will listen for data being sent back 
// from the background renderer process
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
	// parse data output json
	const json = JSON.parse(JSON.stringify(simDataJSON));
	mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
	if(args.message === "simulation_run_complete") {
		mainWindow.webContents.send('JSON_DATA', json)
	}
});

ipcMain.on('MESSAGE_FROM_USER', (event, args) => {
	mainWindow.webContents.send('MESSAGE_TO_BACKGROUND_FROM_USER', {
		message: args.message,
	});
	console.log("From main process: " + args.message);
});

// This listens for the background renderer to confirm it has been set up
// it then sends the cached data to be processed as a response
ipcMain.on('BACKGROUND_READY', (event, args) => {
	event.reply('START_PROCESSING', {
		data: cache.data,
	})
});