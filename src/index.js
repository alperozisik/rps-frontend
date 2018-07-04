import "./styles/cssreset-min.css"; //YUI reset sheet
import './styles/style.css';
import './styles/table.css';
import headerSource from "./header.html";
import { default as router } from './lib/router.js';
import { default as pgRegister } from './pages/register.js';
import { default as pgMain } from './pages/main.js';
import { default as component } from './lib/component';
import { default as pgNewGame } from './pages/newGame.js';
import { default as pgGame } from './pages/game.js';
import { default as pgList } from './pages/list.js';

if (!window.notSupported) {
  let header = component(headerSource);
  document.body.appendChild(header);

  router.add("register", pgRegister);
  router.add("main", pgMain);
  router.add("newGame", pgNewGame);
  router.add("game", pgGame);
  router.add("list", pgList);

  router.go("register");
}












/* function component(innerHtml, autoAdd) {
    const parent = document.createElement('div');
    parent.innerHTML = innerHtml;
    const element = parent.firstChild;
    autoAdd && document.body.appendChild(element);

    return element;
  }*/

/*function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = ['Hello', 'webpack'].join(" ");
  element.classList.add('hello');

  // Add the image to our existing div.
  var myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  console.log(Data);

  return element;
}*/

// component(headerSource, true);
// component(registerSource, true);
// registerInit();
