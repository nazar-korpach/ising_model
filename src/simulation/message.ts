export interface SimalationMessage {
    type: "start" | "comfirm_start" | "stop" | "continue" | "reset" | "stopped" | "filed_map"
}

export interface StartMessage extends SimalationMessage {
    type: "start"
    TICK_PER_EXCHANGE: number
    T: number
    EXPRESSION: string
}

export interface ComfirmMessage extends SimalationMessage {
    type: "comfirm_start",
    frame: Int8Array
}

export interface ContinueMessage extends SimalationMessage {
    type: "continue"
}

export interface StoppedMessage extends SimalationMessage {
    type: "stopped"
}