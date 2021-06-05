import {Model} from './core'

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

