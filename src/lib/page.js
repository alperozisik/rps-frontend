import EventEmiter from 'event-emitter';
import { default as component } from './component.js';
const symHtml = Symbol("html");
const symComponent = Symbol("component");

export default class Page extends EventEmiter {
    constructor(html) {
        super();
        this[symHtml] = html;
        this[symComponent] = component(html);

        Object.defineProperties(this, {
            html: {
                enumerable: true,
                configurable: false,
                get: () => {
                    return this[symHtml];
                }
            },
            component: {
                enumerable: true,
                configurable: false,
                get: () => {
                    return this[symComponent];
                }
            }
        });
    }
}
