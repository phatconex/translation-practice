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
    listVocab.innerHTML = filteredData.map(
        (item) => `<div class="flashcard" onclick="handleTurnCard(event)">
    <div class="flashcard-inner">
        <div class="flashcard-front">
            <p>${item.vocabulary_en}</p>
            <span>${item.phien_am}</span>
        </div>
        <div class="flashcard-back">
            <p>${item.vocabulary_vi}</p>
        </div>
    </div>
</div>`
    );

    //Render vocab
    console.log(filteredData);
}
renderVocab();
function handleTurnCard(event) {
    event.currentTarget.classList.toggle("active");
}
document.querySelector("#btn-practice").addEventListener("click", function () {
    window.location.href = `question.html?topic=${topic}`;
});
