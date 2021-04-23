const puppeteer = require('puppeteer');
const hb = require('handlebars');
const fs = require('fs');
var path = require('path');
import * as ptp from "pdf-to-printer";

export class PrinterService {
  constructor() {
  }

  async printHtml(str: string){
    const strTemplate = `<!DOCTYPE html><html><head></head><body>${str}</body></html>`;
    const template = hb.compile(strTemplate, { strict: true });
    let data = {};
    
    const result = template(data);
    const html = result;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    let check = this.locationForChecks() + `check.${Date.now().toString()}.pdf`;
    
    await page.pdf({ path: check, format: 'A4' });
    await browser.close();
    
    ptp
    .print(check)
    .then(fs.unlinkSync(check))
    .catch(console.error);
  }

  locationForChecks(){
    let checkDir = "";
    let parts = __dirname.split(path.sep);

    for (let i = 0; i < parts.length; i++) {
      checkDir += parts[i] + path.sep;

      if(parts[i] === "vvsDesctopAppTs") {
        checkDir += "checkdir"+ path.sep;
        break;
      }
    }
    return checkDir;
  }
}