const WebSocket = require('ws');
const PrinterService = require('./PrinterService');

class WebSocketService{
    wss;
    printService;
    constructor(port ) {
        this.printService = new PrinterService();

        this.wss = new WebSocket.Server({ port });
        this.wss.on('connection', ws => {
            console.log('connection');

            ws.send(JSON.stringify({ message: "connected"})); 
            ws.on('message', data => this.onMessage(ws, data));
        });
    }
    
    async onMessage(ws , query ){ 
        let request = JSON.parse(query );

        switch(request.action){
            case 'printHtml':
                // this.printService.printHtml(request.data).then(result => {
                //     ws.send(JSON.stringify({action: 'printed'}));
                // });
                await this.printService.printHtml(request.data);
                ws.send(JSON.stringify({action: 'printed'}));
                break;
            case 'checkConnection':
                ws.send(JSON.stringify({action: 'connectionChecked'}));
                break;
        }
        
    }
}
module.exports = WebSocketService