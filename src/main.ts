import {ipcMain, IpcMainEvent, WebContents} from "electron";
import {Model} from "./core"

export const main = async () => {
    const sender = await connect();
    
    simulationLoop(( modelFrame: Int8Array ) => sender.send("domen:model_frame", modelFrame));
}

const connect = (): Promise<WebContents> => {
    return new Promise<WebContents>( (res, rej) => {
        ipcMain.on("view:sync", (event) => {
            event.sender.send("domen:model_frame", [0, 1, 0, 1]);
            res(event.sender);
        })
    })
}


const simulationLoop = (send: (modelFrame: Int8Array) => void) => {    
    const SIZE = 200;
    const T = 2.27;
    const TICK_PER_SECOND = 10;
    const EXPRESSION = '0 * x + 0 * y';

    const model = new Model()
    model.init(SIZE, T, EXPRESSION);

    let i= 30000
    while(i) {
        model.tick();
        send(model.matrix);
        i--;
    }
}