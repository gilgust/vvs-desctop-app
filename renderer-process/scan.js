// const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

    let scanBtn = document.getElementById('scan-btn');
    scanBtn.addEventListener("click", scanning);


function scanning(){
    try {
      ipcRenderer.invoke('scan',{}).then((result) => {
        console.log(result);
      });
      
    } catch (error) {
      console.log(error);
    }
  }

});