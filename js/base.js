function showLoading() {
    const loadingElement = document.querySelector(".preloading");
    loadingElement.style.display = "flex";
}

function hideLoading() {
    const loadingElement = document.querySelector(".preloading");
    loadingElement.style.display = "none";
}
const API_URL = "https://script.google.com/macros/s/AKfycbwZMem0BXoK24Z_CN1Nda7W6g5e6P93Xa1GCV4t6rLuTo1LQCY_sy_y9GNB2Zn777Ae/exec";
async function fetchAPI() {
    showLoading();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert("Not ready");
    } finally {
        hideLoading();
    }
}
