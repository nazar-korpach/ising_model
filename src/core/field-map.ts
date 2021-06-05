import {runInNewContext} from 'vm'

export function fillFieldMap(size: number, extension: string ): number[]{
	let fieldMap: number[] = (new Array(size * size)).fill(0);
	const context = {size, fieldMap};
	try{
		runInNewContext(`
		const fn = (x, y) => {
			return (${extension})			
		}
		fieldMap = fieldMap.map(  (el, i) => {
			const x = Math.abs(i % size - Math.floor(size / 2));
			const y = Math.abs((i - x) / size - Math.floor(size / 2)); 
			return fn( x, y );
		} )`
		, context);
		return context.fieldMap; // TODO: add validation
	}
	catch(err) {
		console.log('shit happened');
		return (new Array(size * size)).fill(0);
	}
}