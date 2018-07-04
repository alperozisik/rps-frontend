import html from './backButton.html';
import { default as component } from './component.js';
import { default as router } from './router';

export default function generateBackButton(back, data) {
    const backButton = component(html);
    backButton.addEventListener("click", (event) => {
        if(typeof back === "string")
            router.go(back, data);
        else
            back.call(backButton, data);
    });
    return backButton;
}
