const electron = require('electron');
const path = require('path');
const url = require('url');

const { app } = electron;
const { BrowserWindow } = electron;

const { ipcMain } = require('electron');

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
		width: 1300,
		height: 900,
		webPreferences: {
			nodeIntegration: true,
			
		},
	});

	mainWindow.loadURL(startUrl);
	process.env.DEV && mainWindow.webContents.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});



let cache = {
    data: undefined,
}

let hiddenWindow;

// This event listener will listen for request
// from visible renderer process
ipcMain.on('START_BACKGROUND_VIA_MAIN', (event, args) => {
	const backgroundFileUrl = url.format({
		pathname: path.join(__dirname, `../background_tasks/background.html`),
		protocol: 'file:',
		slashes: true,
	});
	hiddenWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	hiddenWindow.loadURL(backgroundFileUrl);

	hiddenWindow.webContents.openDevTools();

	hiddenWindow.on('closed', () => {
		hiddenWindow = null;
	});

	cache.data = args.number;
});



ipcMain.on('BACKGROUND_READY', (event, args) => {
    event.reply('START_PROCESSING', { data: cache.data });
})


// event listener will listen for data being sent from background processes
ipcMain.on('MESSAGE_FROM_BACKGROUND', (event, args) => {
    mainWindow.webContents.send('MESSAGE_FROM_BACKGROUND_VIA_MAIN', args.message);
});