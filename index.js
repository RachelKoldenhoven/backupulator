const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  globalShortcut.register('CommandOrControl+Y', () => {
    win.webContents.openDevTools();
  });
  globalShortcut.register('CommandOrControl+R', () => {
    win.webContents.location.reload();
  });
};

app.whenReady().then(() => {
  createWindow();
});
