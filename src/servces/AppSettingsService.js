const data = require('./../../printerSettings.json');
const AppSettings = require('../models/PrinterSettings');
const Printer = require('../models/printer');
const fs = require('fs');
const fileName = './../../printerSettings.json';
const file = require(fileName);

class AppSettingsService {
  _appSettings;
  constructor() {
    let appSettings = new AppSettings();
    appSettings.appDir = data.appDir;
    appSettings.printerForChecks = data.printerForChecks;
    appSettings.printerForInvoice = data.printerForInvoice;
    
    this._appSettings = appSettings;
  }

   get appDir ()  {
    return this._appSettings.appDir;
  }
   set appDir (value ) {
    this._appSettings.appDir = value;
    this.writeSetting("appDir", value);
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

  getPrinteres(){
    let printeres = [
      new Printer("test", false, false),
      new Printer("test2", true, false),
      new Printer("test3", false, true)
    ];

    return printeres;
  }

  writeSetting(key, value) {
    file[key] = value;
    fs.writeFile(fileName, JSON.stringify(file), (err) => {
      if (err){
        return console.log(err);
      }
      
      console.log(JSON.stringify(file));
      console.log('writing to ' + fileName);
    });
  }
}
module.exports = AppSettingsService