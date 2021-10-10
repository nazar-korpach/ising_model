import {app, BrowserWindow, ipcMain, IpcRendererEvent} from 'electron';
import * as path from "path";
import {main} from "./main";

const createWindow =  () => {
	const win = new BrowserWindow({
	  width: 800,
	  height: 600,
	  webPreferences: {
		contextIsolation: true,
		enableRemoteModule: false,
		preload: path.join(__dirname, "preload.js")
	  }
	})
  
	win.loadFile('views/index.html');
	// win.webContents.openDevTools();
}

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
	  createWindow()
	}
})

app.whenReady().then(createWindow).then(main)
