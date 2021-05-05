const WebSocket = require('ws');
const AppSettingsService = require('./appSettingsService');
const PrinterService = require('./printerService');
const ScannerService = require('./scannerService');
const WebSocketActions = require('./../constants/webSocketActions');

class WebSocketService{

    webSocketServer;
    appSettingsService;
    printService;
    scannerService;

    /**
     * @param {number} port
     * @param {AppSettingsService} appSettingsService
     * @param {PrinterService} printerService
     * @param {ScannerService} scannerService
     */
    constructor(port, appSettingsService, printerService, scannerService) {
        this.appSettingsService = appSettingsService;
        this.printService = printerService;
        this.scannerService = scannerService;

        this.webSocketServer = new WebSocket.Server({ port });
        this.webSocketServer.on('connection', ws => {
            console.log('connection');

            ws.send(JSON.stringify({ message: "connected"})); 
            ws.on('message', data => this.onMessage(ws, data));
        });
    }
    
    async onMessage(ws , query ){ 
        let request = JSON.parse(query);
        console.log('webSocketSrvice.onMessage');

        switch(request.action){
            case WebSocketActions.PrintHtml:
                await this.printService.printHtmlAsync(request);
                ws.send(JSON.stringify({action: WebSocketActions.Printed}));
                break;
            case WebSocketActions.CheckConnection:
                ws.send(JSON.stringify({action: WebSocketActions.ConnectionChecked}));
                break;
            case WebSocketActions.Scan:
                console.log(request);
                this.scannerService.runDataReader(request.orderNumber, (result) => {
                    let response = {
                        action: WebSocketActions.Scaned,
                        data : result
                    };
                    console.log('ws: send');
                    console.log(response);
                    ws.send(JSON.stringify({action: WebSocketActions.Scaned, response}));
                });
        }
        
    }
}
module.exports = WebSocketService