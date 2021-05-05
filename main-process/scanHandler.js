const { ipcMain } = require('electron');

const ScannerComPortService = require('./../services/scannerComPortService');

class ScanHandler{
  scannerService;
  /**
   * @param {ScannerComPortService}
   */
  constructor( scannerService ){ 
    console.log('------------------ScanHandler init');
    this.scannerService = scannerService;

    ipcMain.handle('scan', async (event, data) => this.scanningAsync(event, data));
    
  }

  scanning(event, data) {
    this.scannerService.init();
    

    this.scannerService.ScanHandler
    let result = {
      testMessage : 'test'
    };
    
    event.returnValue = result;
  }
  
  async scanningAsync(event, data) {
    this.scannerService.init();
    

    this.scannerService.ScanHandler
    let result = {
      testMessage : 'test'
    };
    let response = await new Promise( resolve => resolve(result));
    return response;
  }
}

module.exports = ScanHandler