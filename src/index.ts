import { AppRoot } from "./app-root";

// init our elements
customElements.define("app-root", AppRoot);

declare const VERSION: string;
console.log(VERSION);
