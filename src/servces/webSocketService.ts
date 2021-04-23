import * as WebSocket from 'ws';
import {PrinterService} from './PrinterService';
import QueryModel from './../models/QueryModel';

export class WebSocketService{
    wss: WebSocket.Server;
    printService : PrinterService;
    constructor(port : number ) {
        this.printService = new PrinterService();

        this.wss = new WebSocket.Server({ port });
        this.wss.on('connection', ws => {
            console.log('connection');

            ws.send(JSON.stringify({ message: "connected"})); 
            ws.on('message', data => this.onMessage(ws, data));
        });
    }
    
    onMessage(ws : any, query : any){ 
        let request : QueryModel = JSON.parse(query as string);

        switch(request.action){
            case 'printHtml':
                this.printService.printHtml(request.data).then(result => {
                    ws.send(JSON.stringify({action: 'printed'}));
                });
                // ws.send(JSON.stringify({action: 'printed'}));
                break;
            case 'checkConnection':
                ws.send(JSON.stringify({action: 'connectionChecked'}));
                break;
        }
        
    }
}