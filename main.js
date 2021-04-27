const { app, Tray, BrowserWindow } = require("electron");
const WebSocketService = require('./src/servces/webSocketService');
const path = require('path');
const glob = require('glob');

let appIcon = null;
let mainWindow = null;
const wsPort = 8998;
const webSocketService = new WebSocketService(wsPort);

function initialize(){
  makeSingleInstance()

  function createMainWindow() {
    
    const mainWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
    });
    mainWindow.loadFile(path.join(__dirname, "./index.html"));
    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () =>{
      mainWindow.show();
    });
    mainWindow.removeMenu();
    return mainWindow;
  }

  function createTray(){
    appIcon = new Tray(path.join(__dirname, 'icon.ico'));
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
    return appIcon;
  }
  
  app.on('ready', () => {
    createMainWindow();
    createTray();
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });

  app.on("window-all-closed", () => {
    app.quit();
  });

  LoadMainProcess();
}
 
initialize();

function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function LoadMainProcess () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'));
  files.forEach((file) => { require(file) });
}


