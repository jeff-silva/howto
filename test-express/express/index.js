import AppModule from "./src/App/AppModule.js";
import AutoModule from "./src/Auto/AutoModule.js";

import { App } from "./src/App.js";
const app = new App([AppModule, AutoModule]);
app.init();
