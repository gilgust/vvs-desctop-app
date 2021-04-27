const {app, ipcMain} = require('electron');
const AppSettingsService = require('./../src/servces/AppSettingsService');
const printerSettings = new AppSettingsService();

//get list of printers
ipcMain.on('get-printers', (event) => {
  printerSettings;
  let printeresPromis = printerSettings.getPrinteresAsync();

  printeresPromis
  .then((result) => { 
    console.log("main-proc result");
    console.log(result);
    event.returnValue = {"printeres" : result, "error" : null};  
  })
  .catch((err) => {
    event.returnValue = {"printeres" : [], "error" : err};  
  });
});

//update printer for check
ipcMain.on('update-printer-for-check', (event, data) => {
  printerSettings.printerForChecks = data;
  let result = {
    "printerForChecks" : printerSettings.printerForChecks, 
    "error" : null
  };
  event.returnValue = result;
});

ipcMain.on('get-app-path', (event) => {
  event.sender.send('got-app-path', app.getAppPath());
});