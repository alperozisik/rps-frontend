import { default as Page } from '../lib/page.js';
import html from './main.html';
import { default as router } from '../lib/router';
const mainPage = new Page(html);
export default mainPage;


mainPage.on("init", () => {
    let btnNewGame = document.querySelector("#newGame");
    let btnJoinGame = document.querySelector("#joinGame");
    let btnAIGame = document.querySelector("#aiGame");

    btnNewGame.addEventListener("click", (event) => {
        router.go("newGame", { opponents: "human" });
    });

    btnAIGame.addEventListener("click", (event) => {
        router.go("newGame", { opponents: "ai" });
    });

    btnJoinGame.addEventListener("click", (event) => {
        router.go("list");
    });
});
