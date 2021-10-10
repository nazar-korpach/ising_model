import {Model} from "../core";
import {ComfirmMessage, SimalationMessage, StartMessage, ContinueMessage} from "./message";

import {ipcMain, IpcMain, WebContents} from "electron";
import {Worker} from "worker_threads";
import * as path from "path"

export class Simulation {
    private inputStream = ipcMain
    private outputStream: WebContents; 

    private T = 2.27
    private SIZE = 400;
    private EXPRESSION = "0 * x + 0 * y"

    private executor: Worker
    private frame: Int8Array
    private isStopped = true;

    constructor(){}

    public async init() {
        this.outputStream = await this.connectToApp();
        this.initAppConnection()

        this.initWorker();
    }

    private connectToApp() {
        return new Promise<WebContents>( (res, rej) => {
            this.inputStream.on("view:sync", (event) => {
                res(event.sender);
            })
        })
    }

    private initAppConnection() {
        this.inputStream.on("view:start", (event, data) => {
            ({T: this.T, EXPRESSION: this.EXPRESSION} = data);
            this.startLoop();
        })
    }

    private initWorker() {
        this.executor = new Worker(path.join(__dirname, "executor.js"));

        this.executor.on("message", (msg: SimalationMessage) => {
            switch (msg.type) {
                case "comfirm_start": this.onComfirmStart( <ComfirmMessage> msg)
                case "stopped": this.onStopped()
            }
        })
    }

    private onComfirmStart(message: ComfirmMessage) {
        this.frame = message.frame;
    }

    private onStopped() {
        const message: ContinueMessage = {type: "continue"};
        this.executor.postMessage(message);

        this.outputStream.send("domen:model_frame", Int8Array.from(this.frame) );
    }

    // TODO make private
    public startLoop() {
        
        const message: StartMessage = {
            type: "start", 
            T: this.T, 
            EXPRESSION: this.EXPRESSION, 
            TICK_PER_EXCHANGE: 100
        }

        this.executor.postMessage(message);
    }


}