import  *  as  data  from  '../printerSettings.json';
import PrinerSettings from  '../models/printerSettings';
import Printer from  '../models/printer';
const fs = require('fs');
const fileName = './../printerSettings.json';
const file = require(fileName);

export default class AppSettingsService {
  private _printerSettings : PrinerSettings;
  constructor() {
    this._printerSettings = new PrinerSettings();
    this._printerSettings.appDir = data.appDir;
    this._printerSettings.printerForChecks = data.printerForChecks;
    this._printerSettings.printerForInvoice = data.printerForInvoice;
  }

  public get appDir () : string {
    return this._printerSettings.appDir;
  }
  public set appDir (value :string) {
    this._printerSettings.appDir = value;
    this.writeSetting("appDir", value);
  }

  public get printerForChecks () {
    return this._printerSettings.printerForChecks;
  }
  public set printerForChecks (value :string) {
    this._printerSettings.printerForChecks = value;
    this.writeSetting("printerForChecks", value);
  }

  public get printerForInvoice () {
    return this._printerSettings.printerForInvoice;
  }
  public set printerForInvoice (value :string) {
    this._printerSettings.printerForInvoice = value;
    this.writeSetting("printerForInvoice", value);
  }

  public getSettings () {
    return this._printerSettings;
  }

  public getPrinteres(){
    let printeres : Array<Printer>  = [
      new Printer("test", false, false),
      new Printer("test2", true, false),
      new Printer("test3", false, true)
    ];

    return printeres;
  }

  writeSetting(key: string, value: string) {
    file[key] = value;
    fs.writeFile(fileName, JSON.stringify(file), (err: any) => {
      if (err){
        return console.log(err);
      }
      
      console.log(JSON.stringify(file));
      console.log('writing to ' + fileName);
    });
  }
}