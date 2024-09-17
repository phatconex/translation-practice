const url = new URL(window.location.href);
const topic = url.searchParams.get("topic");
document.querySelector(".title span").innerHTML = topic;
async function renderVocab() {
    const data = await fetchAPI();

    const uniqueValues = new Set();
    const filteredData = data[topic].vocabulary.filter((item) => {
        if (uniqueValues.has(item.vocabulary_en)) {
            return false;
        }
        uniqueValues.add(item.vocabulary_en);
        return true;
    });

    const listVocab = document.querySelector(".list-vocap");
    filteredData.forEach((item) => {
        listVocab.innerHTML += `<div class="flashcard" onclick="handleTurnCard(event)">
        <div class="flashcard-inner">
            <div class="flashcard-front">
                <p>${item.vocabulary_en}</p>
                <span>${item.phien_am}</span>
            </div>
            <div class="flashcard-back">
                <p>${item.vocabulary_vi}</p>
            </div>
        </div>
    </div>`;
    });

    //Render vocab
    console.log(filteredData);
}
renderVocab();
function handleTurnCard(event) {
    event.currentTarget.classList.toggle("active");
    const word = event.currentTarget.querySelector(".flashcard-front p").innerText;
    speakWord(word);
}

document.querySelector("#btn-practice-question").addEventListener("click", function () {
    window.location.href = `question.html?topic=${topic}`;
});
document.querySelector("#btn-practice-vocab").addEventListener("click", function () {
    window.location.href = `vocabpratice.html?topic=${topic}`;
});
document.querySelector("#btn-multiple-choice").addEventListener("click", function () {
    window.location.href = `multiple-choice.html?topic=${topic}`;
});
