const { app, BrowserWindow, ipcMain, shell } = require('electron');
const clipboard = require('electron-clipboard-extended');
const isDev = Object.values(process.env).some((str) => str.includes('electron .'));
const { pause, resume } = require('./scripts/ffmpeg_utils');
const fs = require('fs');

var path = app.getPath('appData');
if (process.platform === 'win32') path += '\\youtube-downloader\\';
else path += '/youtube-downloader/';
path += 'config.json';

if (!fs.existsSync(path)) {
	var options = {
		path: `${app.getPath('music')}${process.platform === 'win32' ? '\\' : '/'}`,
		parralelNumber: 3,
		playlist: {
			size: 500
		}
	};
	fs.writeFileSync(path, JSON.stringify(options), 'utf8');
}

let win;
let createWindow = () => {
	win = new BrowserWindow({
		height: 800,
		width: 1600,
		frame: false,
		backgroundColor: '#2f3136',
		webPreferences: {
			webSecurity: false,
			nodeIntegration: true,
			nodeIntegrationInWorker: true
		}
	});

	clipboard
		.on('text-changed', () => {
			let link = clipboard.readText();

			if (
				/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/.test(
					link
				) ||
				/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/)*/.test(link)
			)
				win.webContents.send('link', link);
		})
		.startWatching();

	win.loadURL(isDev ? `http://localhost:4200` : `${__dirname}/index.html`);

	// let options = localStorage.getItem('settings');
	// if (!options) {
	// 	localStorage.setItem(
	// 		'settings',
	// 		JSON.stringify({
	// 			download_path: app.getPath('music')
	// 		})
	// 	);
	// }
	win.on('ready-to-show', () => {
		win.show();
	});
	win.on('close', () => {
		win.destroy();
		clipboard.stopWatching();
		win = null;
	});
	ipcMain.on('requestConfigPath', () => {
		win.webContents.send('configPath', path);
	});

	if (isDev) {
		win.webContents.openDevTools();
		try {
			require('electron-reloader')(module);
		} catch (_) {}
	}
	//--------------------------------
	ipcMain.on('stopFFMPEG', (event, pid) => {
		pause(pid);
	});
	ipcMain.on('startFFMPEG', (event, pid) => {
		resume(pid);
	});
	ipcMain.on('folder', (event, path) => {
		shell.showItemInFolder(path);
	});
	ipcMain.on('file', (event, path) => {
		shell.openPath(path);
	});
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
