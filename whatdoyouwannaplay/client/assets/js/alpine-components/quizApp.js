function quizApp() {
    return {
        current: 0,
        selectedAnswer: null,
        score: 0,
        finished: false,
        questions: [
            {
                text: "Quelle est la capitale de la France ?",
                answers: ["Paris", "Londres", "Berlin"],
                correct: 0
            },
            {
                text: "Combien font 2 + 2 ?",
                answers: ["3", "4", "5"],
                correct: 1
            },
            {
                text: "Quel est l’océan le plus grand ?",
                answers: ["Atlantique", "Arctique", "Pacifique"],
                correct: 2
            }
        ],
        submitAnswer() {
            if (this.selectedAnswer == this.questions[this.current].correct) {
                this.score++;
            }
            this.selectedAnswer = null;
            this.current++;
            if (this.current >= this.questions.length) {
                this.finished = true;
            }
        }
    };
}