'use strict';
import{ BrowserWindow , BrowserViewConstructorOptions } from 'electron';
import electron = require('electron');

const defaoltProps : BrowserViewConstructorOptions = {
    width : 500,
    height: 800,
    show: true
} as BrowserViewConstructorOptions;

export default class Window extends BrowserWindow {
    constructor(file : string, windowsSettings? : BrowserViewConstructorOptions){
        super({...defaoltProps , ...windowsSettings} as BrowserViewConstructorOptions);
        
        
        this.loadFile(file);
        this.webContents.openDevTools();

        this.once('ready-to-show', () =>{
            this.show();
        });
    }
}