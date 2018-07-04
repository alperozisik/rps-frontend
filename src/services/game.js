import { request, host, useSecure } from './common.js';
import { getPlayer } from "./player";
const createGame = (owner, gameType, numberOfPlayers) => {
    return request({
        method: "POST",
        url: "/game",
        body: {
            owner: owner.id || owner,
            gameType,
            maximumNumberOfPlayers: numberOfPlayers
        }
    });
};


const joinGame = (game) => {
    return new Promise((resolve, reject) => {
        let url = (useSecure ? "wss://" : "ws://") + host;
        let ws = new WebSocket(url);

        ws.addEventListener('open', function open() {
            ws.readyState === WebSocket.OPEN &&
            ws.send(JSON.stringify({
                type: "joinGame",
                player: getPlayer().id,
                game: game.id || game
            }));
            resolve(ws);
        });

    });
};


const getAvailableGames = () => {
    return request({
        method: "GET",
        url: "/game",
        q: {
            gameState: "waiting"
        }
    });
};


export { createGame, joinGame, getAvailableGames };
