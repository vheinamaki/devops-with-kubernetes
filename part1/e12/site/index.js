import { html, render } from "./preact.js";
import { App } from "./components/App.js";

render(html`<${App} />`, document.body);
