import { app, BrowserWindow, Tray, Menu } from "electron";
import { WebSocketService } from './servces/webSocketService';
import * as path from "path";

let appIcon :any = null;
let mainWindow :BrowserWindow = null;
const port = 3001;
const wsPort = 8998;
const webSocketService = new WebSocketService(wsPort);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.removeMenu(); 
  return mainWindow;
}

function createTray(mainWindow : BrowserWindow = null){
  appIcon = new Tray(path.join(__dirname, '../icon.ico'));
  appIcon.on('click', () => {    
      if (mainWindow == null) return;
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
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  mainWindow = createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow =createWindow();
    }
  });
  
  createTray(mainWindow);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});