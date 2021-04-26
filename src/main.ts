import { app, ipcMain, Tray, BrowserWindow, BrowserViewConstructorOptions } from "electron";
import { WebSocketService } from './servces/webSocketService';
import AppSettingsService from './servces/PrinterSettingsService';
import * as path from "path";
import Window from './window';

let appIcon :any = null;
let mainWindow = null;
const wsPort = 8998;
const webSocketService = new WebSocketService(wsPort);
const printerSettings = new AppSettingsService();

function main(){
  mainWindow = createMainWindow();
  appIcon = createTray(mainWindow);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow =createMainWindow();
    }
  });
  mainWindow.on('closed', function() { 
    mainWindow = null; 
  }); 
  initIpcMain(mainWindow);
}

function createMainWindow() {
  
  const mainWindow = new Window( path.join(__dirname, "../views/settings.html")
    ,{
        width : 1600,
        webPreferences: {
          preload: path.join(__dirname, "./preload.js"),
        }
      } as BrowserViewConstructorOptions
  );
  mainWindow.removeMenu();
  return mainWindow;
}

function createTray(mainWindow : Window ){
  appIcon = new Tray(path.join(__dirname, '../icon.ico'));
  appIcon.on('click', () => {    
      if (mainWindow == null) {
        return;
      }
      if(mainWindow.isVisible()){
          mainWindow.hide();
          mainWindow.setSkipTaskbar(true);
      }
      else{
          mainWindow.show();
          mainWindow.setSkipTaskbar(false);
      }
  });
}

function initIpcMain(mainWindow: Window){
  ipcMain.on('get-printeres', (event, todo) => {
    let printerser = printerSettings.getPrinteres();
    mainWindow.webContents.send('todos', printerser);
  });
  
  ipcMain.on('delete-todo', (event, todo) => {
    mainWindow.webContents.send('todos', '');
  });
}

app.on("ready", main);
app.on("window-all-closed", () => {
  app.quit();
});