const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  getAppName: () => {
    return "Minha App Electron";
  },
});
