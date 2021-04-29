const WebSocket = require('ws');
const AppSettingsService = require('./appSettingsService');
const PrinterService = require('./printerService');
const ScannerServie = require('./scannerServie');

class WebSocketService{

    webSocketServer;
    appSettingsService;
    printService;
    scannerServie;

    /**
     * @param {number} port
     * @param {AppSettingsService} appSettingsService
     * @param {PrinterService} printerService
     * @param {ScannerServie} scannerServie
     */
    constructor(port, appSettingsService, printerService, scannerServie) {
        this.appSettingsService = appSettingsService;
        this.printService = printerService;
        this.scannerServie = scannerServie;

        this.webSocketServer = new WebSocket.Server({ port });
        this.webSocketServer.on('connection', ws => {
            console.log('connection');

            ws.send(JSON.stringify({ message: "connected"})); 
            ws.on('message', data => this.onMessage(ws, data));
        });
    }
    
    async onMessage(ws , query ){ 
        let request = JSON.parse(query);

        switch(request.action){
            case 'printHtml':
                await this.printService.printHtmlAsync(request);
                ws.send(JSON.stringify({action: 'printed'}));
                break;
            case 'checkConnection':
                ws.send(JSON.stringify({action: 'connectionChecked'}));
                break;
            case 'startScanning':
                console.log('webSocketSrvice.onMessage');
                console.log(request);
                this.scannerServie.runDataReader((result) => {
                    let data = {
                        action: 'startScanning',
                        data : result
                    };
                    ws.send(JSON.stringify({action: 'startScanning', data}));
                });
        }
        
    }


}
module.exports = WebSocketService