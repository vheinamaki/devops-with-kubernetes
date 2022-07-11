import { h, render } from "https://cdn.skypack.dev/preact";
import htm from "https://cdn.skypack.dev/htm";
const html = htm.bind(h);

import { App } from "./components/App.js";

render(html`<${App} />`, document.body);
