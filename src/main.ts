import {Simulation} from "./simulation";

export const main = async () => {
    const simulation = new Simulation();
    await simulation.init();
}