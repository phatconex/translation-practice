let userAnswers = [];
const correctSound = new Audio("sound/correct.mp3");
const incorrectSound = new Audio("sound/wrong.mp3");

const url = new URL(window.location.href);
const topic = url.searchParams.get("topic");

const getLocalStorage = JSON.parse(localStorage.getItem(topic));
let currentQuestionIndex = getLocalStorage && getLocalStorage.vocab ? getLocalStorage.question : 0;

async function fetchQuestions() {
    const data = await fetchAPI();
    questions = data[topic].question;
    displayQuestion();
}
async function displayQuestion() {
    const questionElement = document.getElementById("question");
    questionElement.innerHTML = `<span>${currentQuestionIndex}</span>` + questions[currentQuestionIndex]["VI"];
}

function highlightErrors(userAnswer, correctAnswer) {
    const userWords = userAnswer.split(" ");
    const correctWords = correctAnswer.split(" ");

    let highlightedAnswer = userWords
        .map((word, index) => {
            if (word.toLowerCase() !== correctWords[index]?.toLowerCase()) {
                return `<span style="color: red;">${word}</span>`;
            }
            return word;
        })
        .join(" ");

    return highlightedAnswer;
}
const resultElement = document.getElementById("result");
function checkAnswer() {
    const answerElement = document.getElementById("answer");

    const userAnswer = answerElement.value.trim();
    const correctAnswer = questions[currentQuestionIndex]["EN"];

    userAnswers.push({
        question: questions[currentQuestionIndex]["VI"],
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: userAnswer.toLowerCase() === correctAnswer.toLowerCase(),
    });

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        correctSound.play();
        resultElement.innerHTML = '<h3 style="color: green">Correct!</h3>';
        currentQuestionIndex++;
        localStorage.setItem(topic, JSON.stringify({ ...JSON.parse(localStorage.getItem(topic)), question: currentQuestionIndex }));

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            resultElement.innerHTML = "Congratulations! You've completed all the questions.";
            document.getElementById("answer").style.display = "none";
            document.querySelector("button").style.display = "none";
        }
    } else {
        incorrectSound.play();
        const highlightedAnswer = highlightErrors(userAnswer, correctAnswer);
        resultElement.innerHTML = `<h3 style="color: red">Incorrect</h3> <div class="box-result"><p>Your answer:</p> ${highlightedAnswer}</div> <div class="box-result"><p>Correct answer:</p> ${correctAnswer}</div>`;
    }

    answerElement.value = "";
}

function showSummary() {
    const summaryElement = document.getElementById("summary");
    const summaryListElement = document.getElementById("summaryList");
    summaryListElement.innerHTML = "";

    userAnswers.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${entry.question}<br>
            <strong>Your answer:</strong> ${highlightErrors(entry.userAnswer, entry.correctAnswer)}<br>
            <strong>Correct answer:</strong> ${entry.correctAnswer}
        `;
        summaryListElement.appendChild(listItem);
    });

    document.querySelector(".container").style.display = "none";
    summaryElement.style.display = "block";
}

function hideSummary() {
    document.querySelector(".container").style.display = "block";
    document.getElementById("summary").style.display = "none";
}

window.onload = function () {
    fetchQuestions();

    document.getElementById("answer").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    document.getElementById("answer").addEventListener("input", function (event) {
        resultElement.innerHTML = "";
    });

    resultElement.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });

    resultElement.addEventListener("copy", function (event) {
        event.preventDefault();
    });
};
