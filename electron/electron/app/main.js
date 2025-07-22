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
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "allow" };
    });

    // const view1 = new WebContentsView();
    // win.contentView.addChildView(view1);
    // view1.webContents.loadURL("https://electronjs.org");
    // view1.setBounds({ x: 0, y: 0, width: 400, height: 400 });

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
