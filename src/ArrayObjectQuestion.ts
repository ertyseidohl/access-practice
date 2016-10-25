import { Question } from './Question';

export default class ArrayObjectQuestion implements Question {
	public structure: Object | Array<any>;

	private targetContainer: any;
	private potentialTargets: any[];
	public targetString: string;

	constructor(difficulty: number) {
		this.structure = Math.random() > 0.5 ? {} : [];

		this.targetString = this.getRandomLetter(true);
		this.potentialTargets = [this.structure];
		this.targetContainer = this.structure;

		this.obscure(this.structure, difficulty);

		this.setTarget();
	}

	checkAnswer(answer: any): boolean {
		return answer === this.targetString;
	}

	isArray(a: any) {
		return Array.isArray(a);
	}

	isObject(o: any) {
		return typeof(o) === "object" && !this.isArray(o);
	}

	isString(s: any) {
		return typeof(s) === "string";
	}

	buryArray(item: any) {
		var arr = [];
		this.append(item, arr);
		return arr;
	}

	buryObject(item: any) {
		var obj = {};
		this.append(item, obj);
		return obj;
	}

	setTarget() {
		this.targetContainer = this.potentialTargets[
			Math.floor(Math.random() * this.potentialTargets.length)
		];
		this.append(this.targetContainer, this.targetString);
	}

	append(parent: any, child: any) {
		if (this.isArray(parent)) {
			parent.push(child);
		} else if (this.isObject(parent)) {
			parent[this.getRandomLetter(false)] = child;
		}
	}

	addPotentialTarget(item: any) {
		this.potentialTargets.push(item);
	}

	obscure(item: any, difficulty: number) {
		if (difficulty <= 0) {
			return;
		}
		var choice = Math.random();

		if (choice < 0.2) {
			// console.log("buryArray");
			let arr = this.buryArray(item);
			this.addPotentialTarget(arr);
			this.obscure(arr, difficulty - 1);
		} else if (choice < 0.4) {
			// console.log("buryObject");
			let obj = this.buryObject(item);
			this.addPotentialTarget(obj);
			this.obscure(obj, difficulty - 1);
		} else if (choice < 0.6) {
			// console.log("offsetObject");
			// offset object
			let obj = {};
			this.addPotentialTarget(obj);
			this.obscure(obj, difficulty - 1);
			this.append(item, obj);
			this.obscure(item, difficulty - 1);
		} else if (choice < 0.8) {
			// console.log("offsetArray");
			// offset array
			let arr = [];
			this.addPotentialTarget(arr);
			this.obscure(arr, difficulty - 1);
			this.append(item, arr);
			this.obscure(item, difficulty - 1);
		} else {
			// console.log("buryString");
			// bury string
			let str = this.getRandomLetter(false);
			if (!this.isString(item)) {
				this.append(item, str);
				this.obscure(item, difficulty - 1);
			}
		}
	}

	getRandomLetter(isTarget) {
		let letter;
		let opts = "abcdefghjkmnpqrstuvwxyz";
		do {
			letter = opts[Math.floor(Math.random() * opts.length)];


		} while (!isTarget && letter === this.targetString);

		return letter;
	}

	public getPromptText(): string {
		return "struct";
	}

	toString(): string {
		return "var struct = " + JSON.stringify(this.structure, null, '  ');
	}
};
