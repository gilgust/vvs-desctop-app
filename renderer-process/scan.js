// const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

    let scanBtn = document.getElementById('scan-btn');
    scanBtn.addEventListener("click", scanning);


function scanning(){
    try {
      // let reply = ipcRenderer.sendSync('scan');
      // console.log(reply);
      ipcRenderer.invoke('scan').then((result) => {
        console.log(result);
      });
      
    } catch (error) {
      console.log(error);
    }
  }

});