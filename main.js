const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Optionnel : ouvre les DevTools en développement
/*  mainWindow.webContents.openDevTools();*/
const devtools = new BrowserWindow();
    win.webContents.setDevToolsWebContents(devtools.webContents);
    win.webContents.openDevTools({ mode: 'detach' });



}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});