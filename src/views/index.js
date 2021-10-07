const {ipcRenderer} = require('electron');
ipcRenderer.on = api.receive


ipcRenderer.on("domen:model_frame", ( frame ) => draw(frame));

ipcRenderer.send("view:sync");

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const draw = (frame) => {
	const imageBytes = new Uint8ClampedArray(160000)
	for (let i = 0; i < imageBytes.length; i += 4) {
		const j = (frame[i/4]+1)/2;
		imageBytes[i + 0] = j*100;  // R value
		imageBytes[i + 1] = j*255;  // G value
		imageBytes[i + 2] = j*255;  // B value
		imageBytes[i + 3] = 255;	// A value
	}
	
	  // Initialize a new ImageData object
	let imageData = new ImageData(imageBytes, 200, 200);
	context.putImageData(imageData, 0, 0)
}

