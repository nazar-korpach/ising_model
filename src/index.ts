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
	win.webContents.openDevTools();
}

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
	  createWindow()
	}
})

app.whenReady().then(createWindow).then(main)



/*
const SIZE = Math.min(process.stdout.rows, process.stdout.columns) - 1;
const T = 2.27;
const TICK_PER_SECOND = 10;
const EXPRESSION = '0 * x + 0 * y';



const prettyPrint = (model: Model) => {
	process.stdout.write('\n');
	for(let j = 0; j < model.size; j ++){
		for(let i = 0; i < model.size; i++) {
			process.stdout.write( model.matrix[j* model.size + i] > 0 ? ' 0': '. ');
		}
		process.stdout.write('\n');
	}

}

const model = new Model()
model.init(SIZE, T, EXPRESSION);

setInterval(() => {
	console.clear()
	model.tick();
	prettyPrint(model)	
}, 1000 / TICK_PER_SECOND);
*/
