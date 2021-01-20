const { app, BrowserWindow, ipcMain, shell } = require('electron');
const clipboard = require('electron-clipboard-extended');
const isDev = Object.values(process.env).some((str) => str.includes('electron .'));
const { pause, resume } = require('./scripts/ffmpeg_utils');

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
			) {
				console.log(link);
				win.webContents.send('link', link);
			}
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

	if (isDev) {
		try {
			require('electron-reloader')(module);
			win.webContents.openDevTools();
		} catch (_) {}
	}
	//--------------------------------
	ipcMain.on('stopFFMPEG', (event, pid) => {
		console.log(pid, typeof pid);
		pause(pid);
	});
	ipcMain.on('startFFMPEG', (event, pid) => {
		console.log(pid, typeof pid);

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
