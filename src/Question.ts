export interface Question {
	structure: Object | Array<any>;
	targetString: string;
	checkAnswer: (any) => boolean;
	getPromptText: () => string;
}

export default Question;
