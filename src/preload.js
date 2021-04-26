'use strict'

const { ipcRenderer } =require('electron');

ipcRenderer.on('printers', (event, dataPrinters) => {
  console.log(dataPrinters);
  const printerList = document.getElementById('printerList');

  const printers = dataPrinters.reduce((html, printer ) => {
    html += `<li class="printer">${printer.id}</li>`;
    return html;
  }, '');

  printerList.innerHTML = printers;
  
  let arrayElements = printerList.querySelector('.printer');
  arrayElements.forEach(element => {
    element.addEventListener('click', testClick);
  });
});


function testClick (e) {
  ipcRenderer.send('set-printer', e.target.textContent);
}