import { default as Page } from '../lib/page.js';
import html from './register.html';
import { default as router } from '../lib/router';
import { registerPlayer } from '../services/player';
const registerPage = new Page(html);
export default registerPage;

registerPage.on("init", () => {
    let input = document.getElementById("tbRegister");
    let button = document.getElementById("btnRegister");
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            button.click();
        }
    });

    button.addEventListener("click", function(event) {
        var value = input.value;
        if (!value)
            return;
        registerPlayer(value).then(() => {
            router.go("main");
        }).catch(err => {
            console.error(err);
            alert("There has been an error while registering player. Pleace check console");
        });

    });

});


registerPage.on("show", (data) => {
    let input = document.getElementById("tbRegister");
    input.value = "";
});
