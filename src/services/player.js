import { request } from './common.js';
var player = null;

const registerPlayer = (name) => {
    return new Promise((resolve, reject) => {
        request({
            method: "POST",
            url: "/player",
            body: {
                name
            }
        }).then(playerResponse => {
            player = playerResponse;
            resolve(player);
        }, err => {
            reject(err);
        });
    });

};

const getPlayer = () => {
    return player;
};


export { registerPlayer, getPlayer };
