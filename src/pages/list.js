import { default as Page } from '../lib/page.js';
import html from './list.html';
import { default as router } from '../lib/router';
import { default as generateBackButton } from '../lib/backButton';
import { getAvailableGames, joinGame } from "../services/game";
import { default as component } from '../lib/component.js';

const listPage = new Page(html);
export default listPage;

/***************************************************************
 
Table design taken from https://codepen.io/geoffyuen/pen/FCBEg

***************************************************************/

listPage.on("init", () => {
    let backButton = generateBackButton("main");
    let dialog = document.querySelector("#list");
    dialog.insertBefore(backButton, dialog.firstChild);
});


listPage.on("show", (data) => {
    const tbody = document.querySelector("#gameList tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    getAvailableGames().then(gameList => {
        gameList.forEach(gameItem => {
            let row = component(`<tr>
                    <td data-th="Owner">${gameItem.owner.name}</td>
                    <td data-th="Game Type">${gameItem.gameType}</td>
                    <td data-th="Players">${gameItem.joinedPlayers}/${gameItem.maximumNumberOfPlayers}</td>
                    <td data-th="Action"><button gameid="${gameItem.id}" gametype="${gameItem.gameType}">Join</button></td>
                </tr>`);
            let joinButton = row.querySelector("button");
            joinButton.addEventListener("click", joinGameHandler.bind(joinButton));
            tbody.appendChild(row);
        });
    }, (err) => {
        console.error(err);
        alert("There has been an error while listing the games. Please check browser developer console for more information");
    });
});

function joinGameHandler() {
    var gameId = this.attributes.gameid.value;
    var gameType = this.attributes.gametype.value;
    console.log("user selected to join game: " + gameId);

    joinGame(gameId).then(function(ws) {

        ws.addEventListener('message', handler);

        function handler(event) {
            console.log('Message from server ', event.data);
            var message = JSON.parse(event.data);
            wsMessages[message.type] && wsMessages[message.type](message, {
                eventFn: handler,
                gameId,
                gameType
            }, ws);
        }
    }, err => {
        console.error(err);
        alert("There has been an error while joining the game. Please check browser developer console or go back");
    });
}


const wsMessages = {
    joinGameResponse: (message, data, ws) => {
        if (message.success) {
            ws.removeEventListener("message", data.eventFn);
            router.go("game", {
                gameId: data.gameId,
                gameType: data.gameType,
                ws,
                joinType: "join"
            });
        }
        else {
            console.error(message);
            alert("There has been an error while joining the game. Please check browser developer console or go back");
        }
    }
};
