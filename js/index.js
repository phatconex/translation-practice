async function renderTopic() {
    const data = await fetchAPI();
    const arrTopic = Object.keys(data);

    const listTopic = document.querySelector(".list-topic");
    arrTopic.forEach((topic) => {
        listTopic.innerHTML += `<a href="vocab.html?topic=${topic}" class="topic"><span></span>${topic}<span></span></a>`;
    });
}
renderTopic();
