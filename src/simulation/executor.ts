import {Model} from '../core';
import {SimalationMessage, StartMessage, ComfirmMessage} from './message';

import {parentPort} from "worker_threads";

class SimulationExecutor {
    private port = parentPort;
    // model params
    private model = new Model()
    private readonly SIZE = 400
    private T: number
    private EXPRESSION: string

    private stopped = true;
    private ticksPerExchenge: number

    private buffer = new Int8Array(
        new SharedArrayBuffer( Int8Array.BYTES_PER_ELEMENT * this.SIZE * this.SIZE )
    )  

    constructor(){}

    init() {
        this.port.on("message", (msg: SimalationMessage) =>{
            switch(msg.type) {
                case "start": this.initModel( <StartMessage> msg);
                case "continue": this.continue();
            }
        } )
    }

    private initModel(Message: StartMessage) {
        ({T: this.T, EXPRESSION: this.EXPRESSION, TICK_PER_EXCHANGE: this.ticksPerExchenge} = Message);
        this.model.init(this.SIZE, this.T, this.EXPRESSION);

        this.comfirmStart();
        this.simulationLoop()
        this.stop()
    }

    private stop() {
        this.port.postMessage({type: 'stopped'});
    }

    private continue() {
        this.simulationLoop()
        this.stop()
    }

    private comfirmStart() {
        const Message: ComfirmMessage =  {type: "comfirm_start", frame: this.buffer};
        this.port.postMessage( Message );
    }

    private simulationLoop(){
        let i = this.ticksPerExchenge

        while (i) {
            this.model.tick()
            i--
        }

        this.copyToBuffer()
    }

    // TODO move this to model
    private copyToBuffer(){
        this.buffer.set(this.model.matrix);
    }

}

const executor = new SimulationExecutor();
executor.init();