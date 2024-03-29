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
    /**
     * @type{number}
     */
    _countTrytartProcess;

    constructor() {
        this._processWasStart = false;
        this._isFirstRun = false;
        this._countTrytartProcess = 5;
    }

    /**
     * @method -starting Data_Read.exe
     * @param {checkingStatusCallback} checkStatusCallback
     * @param {number} orderNumber
     * @return {void}
     */
    runDataReader(orderNumber, checkStatusCallback){
      
        let dataReader = path.join(app.getAppPath(),'Data_Read.exe');
        exec(dataReader, (err, data) => {  
             console.log(err)
             console.log(data.toString());                       
        });
        
        this.checkingDataReaderIsRunning(orderNumber, checkStatusCallback);
    }

    /**
     * Checking DataReader is running
     * @param {checkingStatusCallback} checkStatusCallback
     */
    checkingDataReaderIsRunning(orderNumber, checkStatusCallback){
        this._checkingStatusTimer = setInterval(() =>
            processes.get(
                (err, processes) => {
                    this._countTrytartProcess = 5;
                    this.checkDataReaderStarted(err, processes, orderNumber, checkStatusCallback);
                }),
                700);
    }

    
    /**
     * @param {any} err
     * @param {Process[]} processes
     * @param {checkingStatusCallback} checkStatusCallback
     */
    checkDataReaderStarted(err, processes, orderNumber, checkStatusCallback){
        
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

        let result = { error : null, orderNumber : orderNumber};
        
        if ( process.length > 0 ) {
            if (!this._processWasStart) {
                console.log('!this._processWasStart', !this._processWasStart);

                this._processWasStart = true;
            }
            if (!this._isFirstRun) {
                console.log('this._isFirstRun', this._isFirstRun);

                this._isFirstRun = true;
                result.status = 'running';
                console.log(result);
                checkStatusCallback(result);
            }
        }
        else{
            if (this._processWasStart &&  this._countTrytartProcess > 0) {
                console.log('this._processWasStart', this._processWasStart);

                this._processWasStart = false;
                this._isFirstRun = false;
                result.status = 'stoped';
                clearInterval(this._checkingStatusTimer);
            }
            else{
                --this._countTrytartProcess;
                result.status = 'tryStratr';
            }
            console.log(result);
            checkStatusCallback(result);
        }
    }

   
}

module.exports = ScannerService;