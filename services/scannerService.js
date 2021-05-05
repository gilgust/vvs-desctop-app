const {app} = require('electron');
const path = require('path');
var exec = require('child_process').execFile;
var processes = require('current-processes');

/**
 * @typedef {Object} DataReaderStatus
 * @property {any} error
 * @property {string} status
 */

/**
 * @typedef {Object} Process
 * @property {number} pid
 * @property {string} name
 * @property {number} cpu
 */

/**
 * This callback send status of DataReader.
 * @callback checkingStatusCallback
 * @param {any}     arg.error
 * @param {string}  arg.status
 * @returns {void}
 */

class ScannerService{
    /**
     * @type {boolean}
     */
    _processWasStart;
    /**
     * @type {boolean}
     */
    _isFirstRun;
    /**
     * @type{NodeJS.Timeout}
     */
    _checkingStatusTimer;

    filewatcher;
    scansdir = path.join(app.getAppPath(), 'scans');

    constructor() {
        this._processWasStart = false;
        this._isFirstRun = false;
    }

    /**
     * @method -starting Data_Read.exe
     * @param {checkingStatusCallback} checkStatusCallback
     * @return {void}
     */
    runDataReader(checkStatusCallback){
      
        let dataReader = path.join(app.getAppPath(),'Data_Read.exe');
        exec(dataReader, (err, data) => {  
             console.log(err)
             console.log(data.toString());                       
        });
        
        this.checkingDataReaderIsRunning(checkStatusCallback);
    }

    /**
     * Checking DataReader is running
     * @param {checkingStatusCallback} checkStatusCallback
     */
    checkingDataReaderIsRunning(checkStatusCallback){
        this._checkingStatusTimer = setInterval(() =>
            processes.get(
                (err, processes) => this.checkDataReaderStarted(err, processes, checkStatusCallback)),
                1000);
    }

    
    /**
     * @param {any} err
     * @param {Process[]} processes
     * @param {checkingStatusCallback} checkStatusCallback
     */
    checkDataReaderStarted(err, processes, checkStatusCallback){
        
        if (err != null) {
            return {
                error: err, 
                status: 'error'
            };
        }

        let process =  processes.filter(item =>{
            if (item.name === 'Data_Read') {
                return item;
            }
        });

        let result = { error : null};
        
        if ( process.length > 0 ) {
            if (!this._processWasStart) {
                this._processWasStart = true;
            }
            if (!this._isFirstRun) {
                this._isFirstRun = true;
                result.status = 'running';
                checkStatusCallback(result);
            }
        }
        else{
            if (this._processWasStart) {
                this._processWasStart = false;
                this._isFirstRun = false;
                result.status = 'stoped';
                clearInterval(this._checkingStatusTimer);
            }
            else{
                result.status = 'tryStratr';
            }
            checkStatusCallback(result);
        }
    }

   
}

module.exports = ScannerService;