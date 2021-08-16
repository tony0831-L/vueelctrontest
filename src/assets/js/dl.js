const ipcRenderer = require('electron').ipcRenderer;
export default async function dl(info,url,itag,type){
    let dlmode=JSON.parse(localStorage.getItem('setting')).dlmode
    info.file_url=url
    switch (dlmode) {
        case "純音樂(預設)":
            info.dlmode='audioonly'
            await ipcRenderer.send('test', JSON.stringify(info));
            break;
        case "手動模式":
            info.dlmode='normal'
            info.itag=itag
            info.type="."+type
            await ipcRenderer.send('test', JSON.stringify(info));
            break;
        case "最高品質":
            info.dlmode='best'
            await ipcRenderer.send('test', JSON.stringify(info));
            break;
        default:
            info.dlmode='audioonly'
            await ipcRenderer.send('test', JSON.stringify(info));
            break;
    }
}