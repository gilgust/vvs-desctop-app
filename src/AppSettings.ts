import  *  as  data  from  './settings.json';

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
  getPrinterForChecks() {
    return this._printerForChecks;
  }
  
  writeSettings(){
    
  }
}