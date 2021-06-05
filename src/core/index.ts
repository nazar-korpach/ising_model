import {fillFieldMap} from './field-map';

const MAX_SIZE = 1024; // TODO increase

const mod = (v, n) => ((v % n) + n) % n // we use mod function because remainders in js suck

export class Model {
	matrix: Int8Array 
	expression: string
	size: number
	T: number
	fieldMap: number[]


	constructor(){}

	init(size: number, T: number, expression: string = ''){
		if( size > MAX_SIZE ){
			throw new Error('size is too large');
		}
		this.size = size;
		this.matrix = new Int8Array(size * size);
		this.T = T;
		this.fillRandom();
		this.fieldMap = fillFieldMap(size, expression);
	}

	private fillRandom(){
		this.matrix.forEach( (el, i) =>{
			this.matrix[i] =  2 * (<any> (Math.random() < 0.5) ) - 1;
		})
	}

	tick(){
		for(let i = 0; i < this.size + this.size; i++){
			this.calculate(  Math.round(Math.random() * this.size * this.size + 1) )
		}
	}

	private calculate(i: number){
		const eddif = this.calculateEddif(i);

		if( eddif <= 0 || ( Math.random() <  Math.exp( (- eddif) / this.T ) ) ){
			this.matrix[i] *= -1;
		}
	}

	private calculateEddif(i: number): number {
		return 2 * this.matrix[i] * ( this.matrix[ this.up(i) ] + 
									this.matrix[ this.down(i) ] + 
									this.matrix[ this.left(i) ] + 
									this.matrix[ this.right(i)] + 
									this.fieldMap[i] * this.matrix[ this.up(i)] + this.matrix[ this.down(i) ]);
	}

	up(i: number): number{
		return ( mod( ( this.getY(i) - 1 ),  this.size ) ) * this.size + this.getX(i);
	}

	down(i: number): number{
		return ( mod( ( this.getY(i) + 1 ),  this.size ) ) * this.size + this.getX(i);
	}

	left(i: number): number{
		return this.getY(i)  * this.size + mod( ( this.getX(i) - 1 ), this.size );
	}

	right(i: number): number{
		return this.getY(i)  * this.size + mod( ( this.getX(i) + 1 ), this.size );
	}

	getY(i: number): number {
		return ( i - this.getX(i) ) / this.size;
	}

	getX(i: number): number{
		return mod(i,  this.size);
	}
}