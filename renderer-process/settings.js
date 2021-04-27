const {ipcRenderer} = require('electron');  

window.addEventListener('DOMContentLoaded', () => {
let checkPrinterList;
let invoicePrinterList;

//update printer for checks
function UpdateCheckPrinter(){
  try {
    let reply = ipcRenderer.sendSync('update-printer-for-check', this.value);
    console.log(reply); 
  } catch (error) {
    console.log(error);
  }
}

//update printer for invoice
function UpdateInvoicePrinter(){
  try {
    let reply = ipcRenderer.sendSync('update-printer-for-invoice', this.value);
    console.log(reply); 
  } catch (error) {
    console.log(error);
  }
}

function init(){
  checkPrinterList = document.getElementById('check-printer-list');
  invoicePrinterList = document.getElementById('invoice-printer-list');
  checkPrinterList.addEventListener("change", UpdateCheckPrinter);
  invoicePrinterList.addEventListener("change", UpdateInvoicePrinter);
}

//load printers
function loadPrinter(){
  try {
    let reply = ipcRenderer.sendSync('get-printers');
    console.log(reply); 
    
    if (reply.error = null || reply.error != undefined) {
      console.log(error);
      return;
    }
    
    //set printers for checks
    let checkPrinters = reply.printeres.
    reduce((acc, element) => {
      let isSelected = element.isCheckPrinter? selected="selected" : "";
      let id = element.id.replace(/\s/g, '-').toLowerCase();
      acc += `<option value="${id}" ${isSelected}>${element.title}</option>`;
      return acc;
    },
    "");
    checkPrinterList.innerHTML = checkPrinters;
    
    //set printers for invoice
    let invoicePrinters = reply.printeres.
    reduce((acc, element) => {
      let isSelected = element.isInvoicePrinter? selected="selected" : "";
      let id = element.id.replace(/\s/g, '-').toLowerCase();
      acc += `<option value="${id}" ${isSelected}>${element.title}</option>`;
      return acc;
    },
    "");
    invoicePrinterList.innerHTML = invoicePrinters;

  } catch (error) {
    console.log(error);
  }
}

init();
loadPrinter();
});