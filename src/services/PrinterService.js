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

    let check = path.join(this.locationForChecks(), `${queryModel.printDataType}.${Date.now().toString()}.pdf`);

    await page.pdf({ path: check, format: 'A4' });
    await browser.close();
    
    console.log(check);
    //print pdf
    pdfToPrinter
    .print(check, { printer: printer.title })
    .then( (data) => fs.unlinkSync(check))
    .catch(error => console.log(error));
  }

  async getPrinterAsync(printDataType){
    let result = await this.appSettings.getPrinterByPrintDataTypeAsync(printDataType);
    
    return result;
  }

  locationForChecks(){
    let checkDir = path.join(app.getAppPath(),'checkdir');

    if (!fs.existsSync(checkDir)) {
      fs.mkdirSync(checkDir);
    }
    
    return checkDir;
  }
  
}

module.exports = PrinterService

// const puppeteer = require('puppeteer');
// const handlebars = require('handlebars');
// const pdfToPrinter = require("pdf-to-printer");
// const {app} = require('electron');
// const fs = require('fs');
// const path = require('path');

// class PrinterService {
//   appSettings;
//   constructor(appSettingsService) {
//     this.appSettings = appSettingsService;
//   }

//   async printHtmlAsync(str){
//     const strTemplate = `<!DOCTYPE html><html><head></head><body>${str}</body></html>`;
//     const template = handlebars.compile(strTemplate, { strict: true });
//     let data = {};
    
//     const result = template(data);
//     const html = result;
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(html);

//     let check = this.locationForChecks() + `check.${Date.now().toString()}.pdf`;
    
//     await page.pdf({ path: check, format: 'A4' });
//     await browser.close();
    
//     pdfToPrinter
//     .print(check)
//     .then(fs.unlinkSync(check))
//     .catch(console.error);
//   }

//    locationForChecks(){
//     let checkDir = path.join(app.getAppPath(),'checkdir');

//     if (!fs.existsSync(checkDir)) {
//       fs.mkdirSync(checkDir);
//     }
    
//     return checkDir;
//   }
// }

// module.exports = PrinterService