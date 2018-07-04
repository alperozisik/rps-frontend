import { default as Page } from '../lib/page.js';
import html from './newGame.html';
import { default as router } from '../lib/router';
import { default as generateBackButton } from '../lib/backButton';
import { GameType } from 'rps-common';
const newGamePage = new Page(html);
export default newGamePage;

newGamePage.on("init", () => {
    let backButton = generateBackButton("main");
    let dialog = document.querySelector("#newGameDialog");
    dialog.insertBefore(backButton, dialog.firstChild);

    let btnCreateGame = document.querySelector("#btnCreateGame");
    btnCreateGame.addEventListener("click", function(event) {
        let options = {
            gameType: GameType[document.querySelector('input[name="gameType"]:checked').value],
            playerCount: Number(document.querySelector('input[name="playerCount"]:checked').value),
            opponents: newGamePage.data.opponents,
            joinType: "owner"
        };
        router.go("game", options);
    });

});

newGamePage.on("show", (data) => {
    newGamePage.data = data;
    document.querySelector("#playVersus").innerHTML =
        `Play vs ${data.opponents}`;

    let gameType_rps = document.querySelector('#gameType_rps');
    gameType_rps.checked = true;

    let player2 = document.querySelector('#player2');
    player2.checked = true;

});
