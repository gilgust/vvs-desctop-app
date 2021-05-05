const { ipcMain } = require('electron');

const ScannerService = require('./../services/scannerService');

class ScanHandler{
  /**
   * @type {ScannerService}
   */
  scannerService;
  /**
   * @param {ScannerService}
   */
  constructor( scannerService ){ 
    console.log('------------------ScanHandler init');
    this.scannerService = scannerService;

    ipcMain.handle('scan', async (event, data) => this.scanningAsync(event, data));
  }

  scanning(event, data) {
    this.scannerService.runDataReader(( error, status) => {
      
    });

    let result = {
      testMessage : 'test'
    };
    
    event.returnValue = result;
  }
  
  async scanningAsync(event, data) {
    var result = this.scannerService(event, data);
    let response = await new Promise( resolve => resolve(result));
    return response;
  }
}

module.exports = ScanHandler