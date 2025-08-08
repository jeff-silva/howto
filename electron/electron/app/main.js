const { app, BrowserWindow, WebContentsView, Menu } = require("electron");
const path = require("path");

require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});

const IS_MAC = process.platform === "darwin";

// Menu.setApplicationMenu(
//   Menu.buildFromTemplate([
//     { label: "File" },
//     {
//       label: "Help",
//       submenu: [
//         {
//           label: "About",
//           click() {
//             alert("aaaa");
//           },
//         },
//       ],
//     },
//   ])
// );

class AppWindow {
  instance = null;

  create() {
    if (this.instance) return this.instance;

    const win = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        webviewTag: true,
        // preload: path.join(__dirname, "preload.js"),
      },
    });

    // win.webContents.openDevTools({ mode: "bottom" });

    win.loadFile(path.join(__dirname, "index.html"));
    win.on("closed", () => {
      this.destroy();
    });

    this.instance = win;
    return this.instance;
  }

  destroy() {
    this.instance = null;
  }
}

const mainWindow = new AppWindow();

app.on("ready", () => {
  mainWindow.create();
});

app.on("activate", () => {
  mainWindow.create();
});

app.on("window-all-closed", () => {
  if (!IS_MAC) app.quit();
});
