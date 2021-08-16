const ipcRenderer = require('electron').ipcRenderer;
export default async function choose(oldpath){
    ipcRenderer.send('choose', oldpath);
}