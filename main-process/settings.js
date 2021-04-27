const {app, ipcMain} = require('electron');

ipcMain.on('get-app-path', (event) => {
  event.sender.send('got-app-path', app.getAppPath())
});


const AppSettingsService = require('./../src/servces/AppSettingsService');
let printerSettings = new AppSettingsService();
ipcMain.on('get-printeres', (event, todo) => {
    let printerser = printerSettings.getPrinteres();
    event.returnValue = printerser;
    // mainWindow.webContents.send('get-printeres', printerser);
    // mainWindow.webContents.send('get-printeres');
});

ipcMain.on('get-app-path', (event) => {
    event.sender.send('got-app-path', app.getAppPath());
});