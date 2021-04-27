class Printer{
    _id ;
    _isCheckPrinter;
    _isInvoicePrinter;
    
    constructor(id , isCheckPrinter, isInvoicePrinter) {
        this._id = id;
        this._isCheckPrinter = isCheckPrinter;
        this._isInvoicePrinter = isInvoicePrinter;
    }
}
module.exports = Printer