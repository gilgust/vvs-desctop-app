class Printer{
    id ;
    title;
    isReceiptPrinter;
    isInvoicePrinter;
    
    constructor(id , title, isReceiptPrinter, isInvoicePrinter) {
        this.id = id;
        this.title = title;
        this.isReceiptPrinter = isReceiptPrinter;
        this.isInvoicePrinter = isInvoicePrinter;
    }
}

module.exports = Printer