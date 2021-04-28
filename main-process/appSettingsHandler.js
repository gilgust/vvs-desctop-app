const {ipcMain} = require('electron');

class AppSettingsHandler{
  printerSettings;
  constructor( appSettingsService ){
    this.printerSettings = appSettingsService;
    //get list of printers
    ipcMain.on('get-printers',(event) =>  this.getPrinters(event));
    //update printer for receipts
    ipcMain.on('update-printer-for-receipt', (event, data) => this.updatePrinterForReceipt(event, data));
    //update printer for invoice
    ipcMain.on('update-printer-for-invoice', (event, data) => this.updatePrinterForInvoice(event, data));
  }

  updatePrinterForReceipt  (event, data) {
    this.printerSettings.printerIdForReceipts = data;
    let result = {
      "printerId" : this.printerSettings.printerIdForReceipts,
      "error" : null
    };
    event.returnValue = result;
  }

  updatePrinterForInvoice(event, data) {
    this.printerSettings.printerIdForInvoice = data;
    let result = {
      "printerId" : this.printerSettings.printerIdForInvoice,
      "error" : null
    };
    event.returnValue = result;
  }

  getPrinters(event) {
    let printeresPromis = this.printerSettings.getPrinteresAsync();
    
    printeresPromis
    .then((result) => {
      event.returnValue = {"printeres" : result, "error" : null};  
    })
    .catch((err) => {
      console.log("printeresPromis.err");
      console.log(err);
      event.returnValue = {"printeres" : [], "error" : err};  
    });
  }
}

module.exports = AppSettingsHandler