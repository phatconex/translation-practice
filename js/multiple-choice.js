const url = new URL(window.location.href);
const topic = url.searchParams.get("topic");

let vocabulary = [];
let currentQuestionIndex = 0;
let correctAnswers = [];
let incorrectAnswers = [];
let score = 0;

const correctSound = new Audio("sound/correct.mp3");
const incorrectSound = new Audio("sound/wrong.mp3");

const questionElement = document.getElementById("question");
const optionButtons = document.querySelectorAll(".option-btn");
const correctList = document.getElementById("correct-list");
const incorrectList = document.getElementById("incorrect-list");
const resultContainer = document.getElementById("result-container");
const scoreElement = document.getElementById("score");

// Gọi API để lấy dữ liệu vocabulary
async function fetchVocabulary() {
    try {
        const response = await fetch("API_URL"); // Thay 'API_URL' bằng đường dẫn thực tế
        const data = await response.json();
        vocabulary = data; // Lưu dữ liệu vào mảng vocabulary
        showQuestion(); // Bắt đầu hiển thị câu hỏi sau khi có dữ liệu
    } catch (error) {
        console.error("Error fetching vocabulary:", error);
    }
}

async function renderVocab() {
    const data = await fetchAPI();

    const uniqueValues = new Set();
    vocabulary = data[topic].vocabulary.filter((item) => {
        if (uniqueValues.has(item.vocabulary_en)) {
            return false;
        }
        uniqueValues.add(item.vocabulary_en);
        return true;
    });
    showQuestion();
    console.log(vocabulary);
}

// Hàm trộn ngẫu nhiên mảng
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Tạo các đáp án với 1 đáp án đúng và 3 đáp án ngẫu nhiên
function generateOptions(correctWord) {
    const allWords = vocabulary.map((item) => item.vocabulary_en);
    let options = [correctWord];

    while (options.length < 4) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }

    return shuffle(options);
}

// Hiển thị câu hỏi
function showQuestion() {
    resetButtonStyles();
    if (currentQuestionIndex < vocabulary.length) {
        const currentQuestion = vocabulary[currentQuestionIndex];
        questionElement.innerHTML = `What is the English word for <span>"${currentQuestion.vocabulary_vi}"</span>?`;

        const options = generateOptions(currentQuestion.vocabulary_en);
        optionButtons.forEach((button, index) => {
            button.textContent = options[index];
            button.disabled = false; // Enable buttons for new question
            button.onclick = () => checkAnswer(button, button.textContent, currentQuestion.vocabulary_en);
        });
    } else {
        endQuiz();
    }
}

// Kiểm tra đáp án và xử lý kết quả
function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
    optionButtons.forEach((button) => (button.disabled = true)); // Disable all buttons

    if (selectedAnswer === correctAnswer) {
        selectedButton.classList.add("correct");
        correctAnswers.push(vocabulary[currentQuestionIndex]);
        score++; // Tăng điểm nếu trả lời đúng
    } else {
        selectedButton.classList.add("incorrect");
        optionButtons.forEach((button) => {
            if (button.textContent === correctAnswer) {
                button.classList.add("correct");
            }
        });
        incorrectAnswers.push({
            word: vocabulary[currentQuestionIndex].vocabulary_en,
            meaning: vocabulary[currentQuestionIndex].vocabulary_vi,
            selected: selectedAnswer,
        });
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1000); // Chuyển câu hỏi sau 1 giây
}

// Reset lại màu của các nút
function resetButtonStyles() {
    optionButtons.forEach((button) => {
        button.classList.remove("correct", "incorrect");
    });
}

// Hiển thị kết quả sau khi kết thúc
function endQuiz() {
    document.getElementById("question-container").style.display = "none";
    resultContainer.style.display = "block";

    // Hiển thị điểm số
    scoreElement.innerHTML = `Your score: <span>${score}/${vocabulary.length}</span>`;

    correctAnswers.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.vocabulary_vi} </span>: <span>${item.vocabulary_en}</span>`;
        correctList.appendChild(li);
    });

    incorrectAnswers.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item.meaning}:</span> You selected <span>"${item.selected}"</span>, correct answer is <span>"${item.word}"</span>`;
        incorrectList.appendChild(li);
    });
}

// Gọi hàm fetchVocabulary để bắt đầu trắc nghiệm
renderVocab();
