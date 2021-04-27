const data = require('./../../printerSettings.json');
const AppSettings = require('../models/PrinterSettings');
const fs = require('fs');
const fileName = './../../printerSettings.json';
const file = require(fileName);
const pdfToPrinter = require("pdf-to-printer");
const Printer = require('../models/printer');

class AppSettingsService {
  _appSettings;
  constructor() {
    let appSettings = new AppSettings();
    appSettings.printerForChecks = data.printerForChecks;
    appSettings.printerForInvoice = data.printerForInvoice;
    
    this._appSettings = appSettings;
  }
  
  get printerForChecks () {
    return this._appSettings.printerForChecks;
  }
  set printerForChecks (value) {
    this._appSettings.printerForChecks = value;
    this.writeSetting("printerForChecks", value);
  }

  get printerForInvoice () {
    return this._appSettings.printerForInvoice;
  }
  set printerForInvoice (value) {
    this._appSettings.printerForInvoice = value;
    this.writeSetting("printerForInvoice", value);
  }

  getSettings () {
    return this._appSettings;
  }

  async getPrinteres(){
    let promis = pdfToPrinter.getPrinters();
    console.log(promis);
    console.log(await promis);
    let promisResult = promis.then(result => { 
      console.log(result);
      new Promis((resolve) => resolve(result));
    });
    return promisResult;
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