import Question from './Question';
import ArrayObjectQuestion from './ArrayObjectQuestion';
import ForLoopQuestion from './ForLoopQuestion';

export class Game {
	private inputElement: HTMLTextAreaElement;
	private questionElement: HTMLDivElement;
	private answerElement: HTMLDivElement;
	private targetElement: HTMLDivElement;
	private difficultyElement: HTMLInputElement;
	private checkAnswerElement: HTMLInputElement;
	private newGameElement: HTMLInputElement;
	private questionTypeElement: HTMLSelectElement;

	private difficulty: number;
	private questionType: string;
	private question: Question;

	constructor() {
		this.inputElement = <HTMLTextAreaElement>
			document.getElementById("input");
		this.targetElement = <HTMLDivElement>
			document.getElementById("target");
		this.questionElement = <HTMLDivElement>
			document.getElementById("question");
		this.answerElement = <HTMLDivElement>
			document.getElementById("answer");
		this.difficultyElement = <HTMLInputElement>
			document.getElementById("difficulty");
		this.checkAnswerElement = <HTMLInputElement>
			document.getElementById("checkAnswer");
		this.newGameElement = <HTMLInputElement>
			document.getElementById("newGame");
		this.questionTypeElement = <HTMLSelectElement>
			document.getElementById("questionType");

		this.difficulty = 1;
		this.questionType = "random";

		this.newGameElement.onclick = this.generateQuestion.bind(this);
		this.difficultyElement.onchange = this.updateDifficulty.bind(this);
		this.checkAnswerElement.onclick = this.checkAnswer.bind(this);
		this.questionTypeElement.onchange = this.changeQuestionType.bind(this);

		this.generateQuestion();
	}

	changeQuestionType() {
		this.questionType = (<HTMLOptionElement>this.questionTypeElement.options[
			this.questionTypeElement.selectedIndex
		]).value;
	}

	updateDifficulty(evt: Event) {
		this.difficulty = parseInt((<HTMLInputElement>evt.target).value, 10);
	}

	checkAnswer() {
		let userCode = this.inputElement.value;

		let struct = this.question.structure;

		try {
			var result = eval(userCode);
			this.answerElement.innerHTML = JSON.stringify(result, null, "  ");
		} catch (e) {
			result = "EXCEPTION:\n" + JSON.stringify(e.message);
			this.answerElement.innerHTML = result;
		}

		if (this.question.checkAnswer(result)) {
			this.newGameElement.className = "btn btn-success";
			this.checkAnswerElement.className = "btn btn-default";
		} else {
			this.newGameElement.className = "btn btn-warning";
			this.checkAnswerElement.className = "btn btn-info";
		}
	}

	generateQuestion(): void {
		if (this.questionType === "random") {
			let types = ["array-object", "for-loop"];
			this.questionType = types[Math.floor(Math.random() * types.length)];
		}
		if (this.questionType === "array-object") {
			this.question = new ArrayObjectQuestion(this.difficulty);
		} else if (this.questionType === "for-loop") {
			this.question = new ForLoopQuestion(this.difficulty);
		}

		this.inputElement.value = this.question.getPromptText();
		this.checkAnswer();

		this.questionElement.innerText = this.question.toString();
		this.targetElement.innerText = "Find: \"" + this.question.targetString + "\"";
	}
};

export default Game; // why?
