const { app, BrowserWindow } = require("electron");
const path = require("path");

class AppWindow {
  instance = null;

  create() {
    if (this.instance) return this.instance;

    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    mainWindow.on("closed", () => {
      this.destroy();
    });

    this.instance = mainWindow;
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
  if (process.platform !== "darwin") {
    app.quit();
  }
});
