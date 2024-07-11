const API_URL = "https://script.google.com/macros/s/AKfycbx3m_fC59WvPaBbctGXsuKvqMKtad7s82KpUp7XSIGUiVMBt5At2E3EAVCzUCn2zGFc/exec";

let currentQuestionIndex = localStorage.getItem("currentQuestionIndex") ? parseInt(localStorage.getItem("currentQuestionIndex")) : 0;
let userAnswers = [];
const correctSound = new Audio("correct.mp3");
const incorrectSound = new Audio("wrong.mp3");

function showLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";
}

function hideLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "none";
}
async function fetchQuestions() {
    showLoading();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        questions = data;
        displayQuestion();
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch questions. Please try again later.");
    } finally {
        hideLoading();
    }
}
function displayQuestion() {
    const questionElement = document.getElementById("question");
    questionElement.innerHTML = `<span>${currentQuestionIndex}</span>` + questions[currentQuestionIndex].vietnamese;
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
    const correctAnswer = questions[currentQuestionIndex].english;

    userAnswers.push({
        question: questions[currentQuestionIndex].vietnamese,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: userAnswer.toLowerCase() === correctAnswer.toLowerCase(),
    });

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        correctSound.play();
        resultElement.innerHTML = '<h3 style="color: green">Correct!</h3>';
        currentQuestionIndex++;
        localStorage.setItem("currentQuestionIndex", currentQuestionIndex);

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
