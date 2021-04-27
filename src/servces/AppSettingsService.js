const data = require('./../../printerSettings.json');
const AppSettings = require('../models/PrinterSettings');
const fs = require('fs');
const fileName = './../../printerSettings.json';
const file = require(fileName);
const pdfToPrinter = require("pdf-to-printer");
const Printer = require('../models/printer');
const { electron } = require('process');

class AppSettingsService {
  _appSettings;
  constructor() {
    let appSettings = new AppSettings();
    appSettings.printerIdForChecks = data.printerIdForChecks;
    appSettings.printerIdForInvoice = data.printerIdForInvoice;
    
    this._appSettings = appSettings;
  }
  
  get printerIdForChecks () {
    return this._appSettings.printerIdForChecks;
  }
  set printerIdForChecks (value) {
    this._appSettings.printerIdForChecks = value;
    this.writeSetting("printerIdForChecks", value);
  }

  get printerIdForInvoice () {
    return this._appSettings.printerIdForInvoice;
  }
  set printerIdForInvoice (value) {
    this._appSettings.printerIdForInvoice = value;
    this.writeSetting("printerIdForInvoice", value);
  }

  getSettings () {
    return this._appSettings;
  }

  async getPrinteresAsync(){
    let promis = pdfToPrinter.getPrinters();
    let promisResult = await promis;
    
    let result = [];
    promisResult.forEach(item =>{
      let id = item.deviceId.replace(/\s/g, '-').toLowerCase();
      let isCheckPrinter = id === this.printerIdForChecks;
      let isInvoicePrinter = id === this.printerIdForInvoice;
      result.push(new Printer(id, item.deviceId, isCheckPrinter, isInvoicePrinter));
    });

    return result;
  }

  writeSetting(key, value) {
    console.log(key);
    console.log(value);

    file[key] = value;

    fs.writeFile(
      fileName, JSON.stringify(file), 
      (err) => {
        if (err){
          return console.log(err);
        }
        console.log(JSON.stringify(file));
        console.log('writing to ' + fileName);
    });
  }
}

module.exports = AppSettingsService