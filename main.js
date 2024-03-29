const { app, Tray, BrowserWindow } = require("electron");
const path = require('path');
const AutoLaunch = require('auto-launch');

const AppSettingsService = require('./services/appSettingsService');
const PrinterService = require('./services/printerService');
const AppSettingsHandler = require('./main-process/appSettingsHandler');
const ScanHandler = require('./main-process/scanHandler');

const ScannerService = require('./services/scannerService');
const WebSocketService = require('./services/webSocketService');

const wsPort = 8998;
let appIcon = null;
let mainWindow = null;
let appSettingsService = new AppSettingsService();
let printerService = new PrinterService(appSettingsService);
let scannerService = new ScannerService();
let appSettingsHandler = new AppSettingsHandler(appSettingsService);
let scanHandler = new ScanHandler(scannerService);
let webSocketService = new WebSocketService(wsPort, appSettingsService, printerService, scannerService);

function initialize(){
  makeSingleInstance();

  function createMainWindow() {
    const mainWindow = new BrowserWindow({
      width: 600,
      height: 600,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
    });
    mainWindow.loadFile(path.join(__dirname, "./index.html"));
    // mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () =>{
      mainWindow.hide();
    }); 

    mainWindow.on('minimize', (event) =>{
      console.log('on minimaze');
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
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
    mainWindow = createMainWindow();
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

}

function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  });
}


var autoLauncher = new AutoLaunch({
    name: "vvs-desctop-app"
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then((isEnabled) => {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch((err) => {
  throw err;
});

initialize();