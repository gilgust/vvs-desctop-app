export default class Printer{
    _id : string;
    _isCheckPrinter: boolean;
    _isInvoicePrinter: boolean;
    
    constructor(id : string, isCheckPrinter: boolean, isInvoicePrinter: boolean) {
        this._id = id;
        this._isCheckPrinter = isCheckPrinter;
        this._isInvoicePrinter = isInvoicePrinter;
    }
}