const fs = require('fs');
const path = require('path');
const {app} = require('electron');
const pdfToPrinter = require("pdf-to-printer");

const data = require(path.join(app.getAppPath(),'printerSettings.json'));
const fileName = path.join(app.getAppPath(),'printerSettings.json');
const file = require(fileName);

const AppSettings = require('../models/PrinterSettings');
const Printer = require('../models/printer');

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
    let promisResult = await pdfToPrinter.getPrinters();
    
    let result = [];
    promisResult.forEach(item =>{
      let id = item.deviceId.replace(/\s/g, '-').toLowerCase();
      let isCheckPrinter = id === this.printerIdForChecks;
      let isInvoicePrinter = id === this.printerIdForInvoice;
      result.push(new Printer(id, item.deviceId, isCheckPrinter, isInvoicePrinter));
    });

    return result;
  }

  async getPrinterByPrintDataTypeAsync(printDataType){
    
    let printersPromis = this.getPrinteresAsync();
    let printers = await printersPromis;
    let result = null;

    switch (printDataType) {
      case 'check':
        printers.forEach(element => {
          if (element.isCheckPrinter) {
            result = element;
          }
        });
        break;
      case 'invoice':

        printers.forEach(element => {
          if (element.isInvoicePrinter) {
            result = element;
          }
        });
        break;
      default:
        throw new Error('Wrong print data type');
        break;
    }
    return result != null 
      ? result 
      : new Printer("", "", false, false);
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