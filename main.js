const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = Object.values(process.env).some((str) => str.includes('electron .'));

let win;
let createWindow = () => {
	win = new BrowserWindow({
		height: 800,
		width: 1600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	});
	win.loadURL(isDev ? `http://localhost:4200` : `${__dirname}/index.html`);
	win.on('ready-to-show', () => {
		win.show();
	});
	win.on('close', () => {
		win.destroy();
		win = null;
	});

	if (isDev) {
		try {
			require('electron-reloader')(module);
		} catch (_) {}
		win.webContents.openDevTools();
	}
	ipcMain.on('close', () => {
		win.close();
	});
	ipcMain.on('minimize', () => {
		win.minimize();
	});
	ipcMain.on('fullscreen', () => {
		if (win.isMaximized()) win.unmaximize();
		else win.maximize();
	});
};

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on('ready', createWindow);
