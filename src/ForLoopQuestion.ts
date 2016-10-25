import { Question } from './Question';

export default class ForLoopQuestion implements Question {
	public structure: Object | Array<any>;
	public targetString: string;

	private targetArray: string[];
	private targetCount: number;

	constructor(difficulty: number) {

		this.targetCount = Math.floor(Math.random() * 7) + 3;

		this.targetArray = [];

		for (let i = 0; i < this.targetCount; i++) {
			this.targetArray.push(this.getRandomLetter(true));
		}

		this.targetString = "[" + this.targetArray.join(",") + "]";

		this.structure = {a: [1, 2, 3]};

	}

	getRandomLetter(isTarget) {
		let letter;
		let opts = "abcdefghjkmnpqrstuvwxyz";
		do {
			letter = opts[Math.floor(Math.random() * opts.length)];
		} while (!isTarget &&
			this.targetArray.indexOf(letter) !== -1
		);

		return letter;
	}

	public checkAnswer(answer: any): boolean {
		return true; // todo
	}

	public toString(): string {
		return JSON.stringify(this.structure, null, "\t");
	}

	public getPromptText(): string {
		return "for () {\n\n}";
	}
}
