const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const pdfToPrinter = require("pdf-to-printer");
const {app} = require('electron');
const fs = require('fs');
const path = require('path');

class PrinterService {
  appSettings;
  constructor(appSettingsService) {
    this.appSettings = appSettingsService;
  }

  async printHtmlAsync(queryModel){
    const str = queryModel.data;
    let printer;
    try {
      printer = await this.getPrinterAsync(queryModel.printDataType); 
    } catch (error) {
      console.log(error);
      return;
    }

    if ( printer.id === "") {
      console.log("Printer not set");
      return;
    }

    //generate pdf
    let data = {};
    const strTemplate = `<!DOCTYPE html><html><head></head><body>${str}</body></html>`;
    const template = handlebars.compile(strTemplate, { strict: true });
    const html = template(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    let receipt = path.join(this.locationForReceipts(), `${queryModel.printDataType}.${Date.now().toString()}.pdf`);

    await page.pdf({ path: receipt, format: 'A4' });
    await browser.close();
    
    console.log(receipt);
    //print pdf
    pdfToPrinter
    .print(receipt, { printer: printer.title })
    .then( (data) => fs.unlinkSync(receipt))
    .catch(error => console.log(error));
  }

  async getPrinterAsync(printDataType){
    let result = await this.appSettings.getPrinterByPrintDataTypeAsync(printDataType);
    
    return result;
  }

  locationForReceipts(){
    let receiptDir = path.join(app.getAppPath(),'receiptdir');

    if (!fs.existsSync(receiptDir)) {
      fs.mkdirSync(receiptDir);
    }
    
    return receiptDir;
  }
  
}

module.exports = PrinterService