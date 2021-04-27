class Printer{
    id ;
    title;
    isCheckPrinter;
    isInvoicePrinter;
    
    constructor(id , title, isCheckPrinter, isInvoicePrinter) {
        this.id = id;
        this.title = title;
        this.isCheckPrinter = isCheckPrinter;
        this.isInvoicePrinter = isInvoicePrinter;
    }
}
module.exports = Printer