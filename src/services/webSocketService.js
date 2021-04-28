const WebSocket = require('ws');

class WebSocketService{
    webSocketService;
    printService;
    appSettings;
    constructor(port, appSettingsService, printerService) {
        this.appSettings = appSettingsService;
        this.printService = printerService;

        this.webSocketService = new WebSocket.Server({ port });
        this.webSocketService.on('connection', ws => {
            console.log('connection');

            ws.send(JSON.stringify({ message: "connected"})); 
            ws.on('message', data => this.onMessage(ws, data));
        });
    }
    
    async onMessage(ws , query ){ 
        let request = JSON.parse(query );

        switch(request.action){
            case 'printHtml':
                await this.printService.printHtmlAsync(request);
                ws.send(JSON.stringify({action: 'printed'}));
                break;
            case 'checkConnection':
                ws.send(JSON.stringify({action: 'connectionChecked'}));
                break;
        }
        
    }
}
module.exports = WebSocketService