const electron = require('electron');
const path = require('path');
const url = require('url');

const { app } = electron;
const { BrowserWindow } = electron;

const { ipcMain } = require('electron');
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
		width: 1200,
		height: 800,
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
}
app.on('ready', createWindow);

// TODO: Temporarily set this to just quit to see if it would work properly with windows
app.on('window-all-closed', () => {
	app.quit
  // if (process.platform !== 'darwin') {
  //  app.quit();
  //}
});

app.on('activate', () => {
  if (mainWindow === null) {
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
});

// This event listener will listen for data being sent back 
// from the background renderer process
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
	// parse data output json
	const json = JSON.parse(JSON.stringify(simDataJSON));
	console.log("test");
	console.log(json);
	mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
	if(args.message === "simulation_run_complete") {
		mainWindow.webContents.send('JSON_DATA', json)
		hiddenWindow.close();
	}
});

// This listens for the background renderer to confirm it has been set up
// it then sends the cached data to be processed as a response
ipcMain.on('BACKGROUND_READY', (event, args) => {
	event.reply('START_PROCESSING', {
		data: cache.data,
	})

});

