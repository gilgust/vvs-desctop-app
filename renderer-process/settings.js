const {ipcRenderer} = require('electron');  

window.addEventListener('DOMContentLoaded', () => {
let receiptPrinterList;
let invoicePrinterList;

//update printer for receipts
function UpdateReceiptPrinter(){
  try {
    let reply = ipcRenderer.sendSync('update-printer-for-receipt', this.value);
  } catch (error) {
    console.log(error);
  }
}

//update printer for invoice
function UpdateInvoicePrinter(){
  try {
    let reply = ipcRenderer.sendSync('update-printer-for-invoice', this.value);
  } catch (error) {
    console.log(error);
  }
}

function init(){
  receiptPrinterList = document.getElementById('receipt-printer-list');
  invoicePrinterList = document.getElementById('invoice-printer-list');
  receiptPrinterList.addEventListener("change", UpdateReceiptPrinter);
  invoicePrinterList.addEventListener("change", UpdateInvoicePrinter);
}

//load printers
function loadPrinter(){
  try {
    let reply = ipcRenderer.sendSync('get-printers');
    
    if (reply.error = null || reply.error != undefined) {
      console.log(error);
      return;
    }
    
    //set printers for receipts
    let receiptPrinters = reply.printeres.
      reduce((acc, item) => {
        let isSelected = item.isReceiptPrinter? selected="selected" : "";
        let id = item.id.replace(/\s/g, '-').toLowerCase();
        acc += `<option value="${id}" ${isSelected}>${item.title}</option>`;
        return acc;
      }, "");
    receiptPrinterList.innerHTML = receiptPrinters;
    
    //set printers for invoice
    let invoicePrinters = reply.printeres.
      reduce((acc, item) => {
        let isSelected = item.isInvoicePrinter? selected="selected" : "";
        let id = item.id.replace(/\s/g, '-').toLowerCase();
        acc += `<option value="${id}" ${isSelected}>${item.title}</option>`;
        return acc;
      }, "");
    invoicePrinterList.innerHTML = invoicePrinters;

  } catch (error) {
    console.log(error);
  }
}

init();
loadPrinter();
});