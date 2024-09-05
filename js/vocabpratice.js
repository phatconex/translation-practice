const url = new URL(window.location.href);
const topic = url.searchParams.get("topic");
let currentIndex = JSON.parse(localStorage.getItem(topic)) ? JSON.parse(localStorage.getItem(topic)).vocab : 0;
let vocabulary = [];
const correctSound = new Audio("sound/correct.mp3");
const incorrectSound = new Audio("sound/wrong.mp3");
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
    console.log(vocabulary);
    showWord();
}

async function showWord() {
    console.log(vocabulary.length);
    if (currentIndex < vocabulary.length) {
        document.getElementById("question").innerText = vocabulary[currentIndex].vocabulary_vi;
        document.getElementById("answer").value = "";
    } else {
        document.querySelector(".boxquestion").innerHTML = `<img src="img/congrats.jpg" alt="">`;
        document.getElementById("result").innerText = "YOU HAVE FINSHED ALL OF VOCABULARY, WELL DONE!";
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    const correctAnswer = vocabulary[currentIndex].vocabulary_en.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById("result").innerText = "CORRECT!";
        currentIndex++;
        correctSound.play();
        localStorage.setItem(topic, JSON.stringify({ ...JSON.parse(localStorage.getItem(topic)), vocab: currentIndex }));
        if (currentIndex < vocabulary.length) {
            showWord();
        } else {
            document.getElementById("result").innerText = "YOU HAVE FINSHED ALL OF VOCABULARY, WELL DONE!";
            document.querySelector(".boxquestion").innerHTML = `<img src="img/congrats.jpg" alt="">`;
        }
    } else {
        document.getElementById("result").innerText = "WRONG, TRY AGAIN!";
        incorrectSound.play();
    }
}

// Hiển thị từ đầu tiên khi trang tải lên
renderVocab();
document.getElementById("answer").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
