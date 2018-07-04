import { default as Page } from '../lib/page.js';
import { default as component } from '../lib/component.js';
import html from './game.html';
import { default as router } from '../lib/router';
import { Game, Round, GameType, /*Action,*/ Player } from 'rps-common';
import { default as generateBackButton } from '../lib/backButton';
import { getPlayer } from "../services/player";
import { createGame, joinGame } from "../services/game";
const gamePage = new Page(html);
const leaveGameMessage = "Are you sure to end the game? Closing or returning will cause to end for all players";
const gameEndedMessage = "One of other players have ended the game or connection to the server is lost. Press OK to return home";
var gameIsInPlay = false;
var terminateWS = null;

export default gamePage;

gamePage.on("init", () => {
    let backButton = generateBackButton(() => {
        if (gameIsInPlay) {
            if (confirm(leaveGameMessage)) {
                terminateWS && terminateWS(false);
                router.go("main");
            }
            else {
                // Do nothing!
            }
        }
        else
            router.go("main");
    });
    let dialog = document.querySelector("#game");
    dialog.insertBefore(backButton, dialog.firstChild);

    document.querySelectorAll("#chooseAction a").forEach((button) => {
        button.addEventListener("click", function(event) {
            userActionHandler.call(this);
        });
    });
});


gamePage.on("show", (data) => {
    terminateWS = null;
    gameIsInPlay = false;
    let btnSpock = document.querySelector("#actionSpock");
    let btnLizard = document.querySelector("#actionLizard");
    let gameType = data.gameType;
    if (typeof gameType === "string") {
        gameType = GameType[gameType];
    }
    btnSpock.style.display = btnLizard.style.display =
        gameType === GameType.RPS ?
        "none" : "";

    const gamePlayHistory = document.querySelector("#gamePlayHistory");
    while (gamePlayHistory.firstChild) {
        gamePlayHistory.removeChild(gamePlayHistory.firstChild);
    }

    gamePage.actionHandler = null;
    if (data.joinType === "owner") {
        if (data.opponents === "ai") {
            enableButtons();
            playVsAI(data.playerCount, gameType);
        }
        else {
            disableButtons();
            playVsPlayer(data.playerCount, gameType, true);
        }
    }
    else {
        disableButtons();
        playVsPlayer(data.playerCount, gameType, false, data.ws, data.gameId);
    }
});

function disableButtons() {
    document.querySelectorAll("#chooseAction a").forEach(element => element.classList.add("disabled"));
}

function enableButtons() {
    document.querySelectorAll("#chooseAction a").forEach(element => element.classList.remove("disabled"));
}

function addRow(content) {
    const gamePlayHistory = document.querySelector("#gamePlayHistory");
    const row = createRow();

    if (typeof content === "string") {
        content = component(content);
    }
    row.appendChild(content);

    gamePlayHistory.appendChild(row);

    gamePlayHistory.scrollTop = gamePlayHistory.scrollHeight;
    return row;
}

function createRow() {
    const row = document.createElement("div");
    row.classList.add("gameRow");
    return row;
}


function addLog(text) {
    return addRow(`<span class="gameLog">${text}</span>`);
}

function logRound(game, round, winner) {
    var playerActions = "";
    for (let pa of round) {
        playerActions +=
            `<div class="playerAction">
                <span class="playerActionPlayerName">${pa[0].name}</span>
                <div class="playerActionIcon playerActionIcon-${pa[1].name}"></div>
                <span class="playerActionWinner" style="display:${pa[0] === winner? "inherit": "none"};">Winner</span>
            </div>`;
    }
    var rowContent = `<div class="roundLog"><span>${game.round}</span>
        <div class="playerActionsRow">
            ${playerActions}
        </div>
    </div>`;
    return addRow(rowContent);
}

function playVsPlayer(numberOfPlayers, gameType, isOwner, ws, gameId) {
    if (isOwner) {
        createGame(getPlayer(), gameType.name, numberOfPlayers).then((serverGame) => {
            const ownerPlayer = new Player(getPlayer().name);

            joinGame(serverGame).then(function(ws) {
                ws.addEventListener('message', function(event) {
                    console.log('Message from server ', event.data);
                    var message = JSON.parse(event.data);
                    wsMessages[message.type] && wsMessages[message.type](message, {
                        ownerPlayer,
                        gameId: serverGame.id,
                        gameType
                    }, ws);

                });
                multiPlayerUserActionHandler(ws);
                setTerminateWS(ws);

            }, err => {
                console.error(err);
                alert("There has been an error while joining the game. Please check browser developer console or go back");
            });
        });
    }
    else {
        ws.addEventListener('message', function(event) {
            console.log('Message from server ', event.data);
            var message = JSON.parse(event.data);
            wsMessages[message.type] && wsMessages[message.type](message, {
                gameId,
                gameType
            }, ws);
        });
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({
            type: "getPlayerList",
        }));
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({
            type: "playerReady",
        }));
        multiPlayerUserActionHandler(ws);
        setTerminateWS(ws);
    }
}

function playVsAI(numberOfPlayers, gameType) {
    const ownerPlayer = new Player(getPlayer().name);
    addLog(getPlayer().name + " joined");
    const aiPlayers = [];
    for (let i = 1; i < numberOfPlayers; i++) {
        let aiName = "AI Player " + i;
        addLog(aiName + " joined");
        let aiPlayer = new Player(aiName);
        aiPlayers.push(aiPlayer);
    }

    var game = new Game(gameType, ownerPlayer, ...aiPlayers);

    gamePage.actionHandler = function actionHandler(userActionName) {
        var round = new Round();
        round.set(ownerPlayer, game.possibleActions[userActionName]);
        for (let ai of aiPlayers) {
            round.set(ai, game.possibleActions[pickRandomAction(game)]);
        }
        var winnerPlayer = game.playRound(round);

        logRound(game, round, winnerPlayer);

    };
}

function pickRandomAction(game) {
    var possibleActions = Object.keys(game.possibleActions);
    var selectedIndex = getRandomInt(possibleActions.length);
    return possibleActions[selectedIndex];

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function userActionHandler() {
    var button = this;
    if (button.classList.contains("disabled"))
        return;
    var actionName = button.attributes.action.value;
    console.log("user selected " + actionName);
    gamePage.actionHandler && gamePage.actionHandler(actionName);

}

function createMultiplayerGame(players, gameType) {
    var playerList = [];
    players.forEach(p => {
        let player = new Player(p.name);
        player.id = p.id;
        playerList.push(player);
    });
    var game = new Game(gameType, ...playerList);

    wsMessages.recieveRound = (message, data, ws) => {
        let roundData = message.round.slice(0);
        roundData.forEach(playerActionPair => {
            playerActionPair[0] = findPlayer(playerActionPair[0]);
            playerActionPair[1] = game.possibleActions[playerActionPair[1]];
        });
        let round = new Round(roundData);
        var winnerPlayer = game.playRound(round);

        logRound(game, round, winnerPlayer);
        enableButtons();
    };

    function findPlayer(p) {
        for (let player of playerList) {
            if (p.id === player.id)
                return player;
        }
        return null;
    }
}

function multiPlayerUserActionHandler(ws) {
    gamePage.actionHandler = function(actionName) {
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({
            type: "userPlays",
            userPlays: actionName
        }));
        disableButtons();
        addLog(`You have played ${actionName}`);
    };
}

function setTerminateWS(ws) {
    terminateWS = function(alertGameEnded) {
        gameIsInPlay = false;
        ws.close();

        if (alertGameEnded) {
            alert(gameEndedMessage);
            router.go("main");
        }
    };

    ws.onclose = () => {
        if (gameIsInPlay) {
            alert(gameEndedMessage);
            router.go("main");
        }
    };
}

const wsMessages = {
    joinGameResponse: (message, data, ws) => {
        if (message.success) {
            addLog(getPlayer().name + " joined");
            ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({
                type: "playerReady",
            }));
            gameIsInPlay = true;
        }
        else {
            console.error(message);
            alert("There has been an error while joining the game. Please check browser developer console or go back");
        }
    },
    playerJoined: (message, data, ws) => {
        addLog(`New player joined the game: ${message.newPlayerName}. Players: ${message.playerCount}/${message.maximumNumberOfPlayers}`);
    },
    getPlayerListResponse: (message, data, ws) => {
        gameIsInPlay = true;
        message.players.forEach(player => {
            addLog(`${player.name} has joined the game`);
        });
    },
    gameReady: (message, data, ws) => {
        addLog("Game is ready, enjoy!");
        enableButtons();
        createMultiplayerGame(message.players, data.gameType);
    },
    endGame: (message, data, ws) => {
        terminateWS && terminateWS(true);
    }
};

window.addEventListener("beforeunload", function(e) {
    if (gameIsInPlay) {
        (e || window.event).returnValue = leaveGameMessage; //Gecko + IE
        return leaveGameMessage; //Gecko + Webkit, Safari, Chrome etc.
    }
});
