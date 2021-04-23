import  *  as  data  from  './settings.json';
const fs = require('fs');
const fileName = './settings.json';
const file = require(fileName);

export class Settings {
  private _appDir :string ;
  private _printerForChecks : string ;

  constructor() {
    this._appDir = data.appDir;
    this._printerForChecks = data.printerForChecks;
  }

  getAppDir() {
    return this._appDir;
  }
  
  setAppDir(value :string) {
    this.writeSetting("appDir", value);
  }

  getPrinterForChecks() {
    return this._printerForChecks;
  }

  writeSetting(key: string, value: string) {
    file[key] = value;
    fs.writeFile(fileName, JSON.stringify(file), (err: any) => {
      if (err){
        return console.log(err);
      }
      
      this[key] = value;
      console.log(JSON.stringify(file));
      console.log('writing to ' + fileName);
    });
  }
}