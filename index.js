const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';

const questionElement = document.getElementById('questions');
const choices = Array.from(document.getElementsByClassName('btn'));
const scoreText = document.querySelector('#score');
const nextBtn = document.getElementById('next-btn');
const quiz=document.querySelector('.quiz');
let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter = 0;
let score = 0;
let availableQuestions = [];
let questions = [];

fetch(apiUrl)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    scoreText.innerHTML= score;
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0) {
        quiz.classList.add('completed');
        quiz.innerHTML=`<h1>
        Thank You !<br>Your score is :- ${score}</h1>`;
        return;
    }
    questionCounter++;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionElement.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;
        localStorage.setItem('selectedOption', choice.getAttribute('data-option'));
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const selected = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if (selected === 'correct') {
            choice.classList.add('correct');
            incrementScore();

        }
        else{
            choice.classList.add('incorrect');
        }
        choices.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
    });
});

incrementScore = () => {
    score++;
    scoreText.innerText = score;
};

nextBtn.addEventListener('click',()=>{

    choices.forEach(choice => {
        choice.classList.remove('correct', 'incorrect');
        choice.style.pointerEvents = 'auto';
    });
    getNewQuestion();
})
