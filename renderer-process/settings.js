const {ipcRenderer} = require('electron');

const syncMsgBtn = document.getElementById('sync-msg');
const appAddress = document.getElementById('app-address');

syncMsgBtn.addEventListener('click', () => {
  let reply = ipcRenderer.sendSync('get-printeres');
  console.log(reply);
})

appAddress.addEventListener('click', () => {
  let reply = ipcRenderer.sendSync('get-app-path');
  console.log(reply);
});