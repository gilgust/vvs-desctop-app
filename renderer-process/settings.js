const {ipcRenderer} = require('electron');  

window.addEventListener('DOMContentLoaded', () => {
let checkPrinterList;
let invoicePrinterList;

//update printer for checks
function UpdateCheckPrinter(){
  console.log(this);
  console.log(this.value);
  try {
    let reply = ipcRenderer.sendSync('update-printer-for-check', this.value);
    console.log(reply); 
  } catch (error) {
    console.log(error);
  }
}

function init(){
  checkPrinterList = document.getElementById('check-printer-list');
  invoicePrinterList = document.getElementById('invoice-printer-list');
  checkPrinterList.addEventListener("change", UpdateCheckPrinter);
  // invoicePrinterList.addEventListener("change", UpdateInvoicePrinter);
}

//load printers
function loadPrinter(){
  try {
    let reply = ipcRenderer.sendSync('get-printers');
    console.log(reply); 
    if (reply.error != null && reply.error != undefined) {
      console.log(error);
      return;
    }
    console.log(reply);
    
    //set printers for checks
    let checkPrinters = reply.
    reduce((acc, element) => {
      let isSelected = element.isCheckPrinter? selected="selected" : "";
      acc += `<option value="${element.id}" ${isSelected}>${element.id}</option>`;
    },
    "");
    checkPrinterList.innerHtml = checkPrinters;
    
    //set printers for invoice
    let invoicePrinters = reply.
    reduce((acc, element) => {
      let isSelected = element.isInvoicePrinter? selected="selected" : "";
      acc += `<option value="${element.id}" ${isSelected}>${element.id}</option>`;
    },
    "");
    invoicePrinterList.innerHtml = invoicePrinters;

  } catch (error) {
    console.log(error);
  }
}

init();
loadPrinter();
});