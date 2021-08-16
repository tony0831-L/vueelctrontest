'use strict'

import { app, protocol, BrowserWindow ,nativeTheme,ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import fs from 'fs'
import ytdl from 'ytdl-core'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
var ffmpeg = require('../node_modules/fluent-ffmpeg');
const isDevelopment = process.env.NODE_ENV !== 'production'
const getbest = require('./assets/js/getbest.js')
const dialog = require('electron').dialog;

// Scheme must be registered before the app is ready
//別動
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  //深色主題
  nativeTheme.themeSource = 'dark'
  
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 770,
    //icon
    icon: 'favicon.ico',
    //隱藏工具欄
    autoHideMenuBar:true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,//注入node的配置項目
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,//上下文隔离
      webSecurity:false,    //處理跨域
      nodeIntegrationInWorker: true
    }
  })

  //配置入口文件
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// 同步窗口關閉程式.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
ipcMain.on("test", (event, args) => {
    let info = JSON.parse(args)
    info.title=info.title.replace(/[\|&;\$%@"<>\(\)\+,]/g, "")
    info.title=info.title.replace(/ /g,"-")
    let file =info.file_url+"\\"+info.title
    let url =info.url
    console.log(file)
    switch (info.dlmode) {
      case 'audioonly':
        getbest(url).then(data=>{
          ytdl(url,{quality:data.highestaudio}).on('progress',(c,td,tdl)=>{event.sender.send('testreply',"正在下載:"+info.title+".mp3:"+Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream(file+'.mp3')).on('close',()=>{
            event.sender.send('testreply', info.title+'.mp3 下載完成');
          })})
        break;
      case 'best':
        console.log(file)
        getbest(url).then(data=>{
          ytdl(url,{quality:data.highestaudio}).on('progress',(c,td,tdl)=>{event.sender.send('testreply',"正在下載:"+info.title+"的音效檔:"+Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream('temp.mp3')).on('close',()=>{
            ytdl(url,{quality:data.highestvideo}).on('progress',(c,td,tdl)=>{event.sender.send('testreply',"正在下載:"+info.title+"的影片檔:"+Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream('temp.mp4')).on('close',()=>{
              ffmpeg()
              .addInput('temp.mp4')
              .addInput('temp.mp3')
              .saveToFile(file.file_url+info.title+".mp4")
              .on('progress',(progress)=>{
                console.log(info.title+':'+Math.floor(progress.percent)+"%")
                event.sender.send('testreply',info.title+'的轉檔進度:'+Math.floor(progress.percent)+"%")
              })
              .on('end',()=>{
                event.sender.send('testreply',info.title+".mp4已下載完成")
                  fs.unlink("temp.mp3",(err)=>{})
                  fs.unlink("temp.mp4",(err)=>{})
              });
          })
          })
        })
        break;
      case 'normal':
        console.log(info)
        getbest(url).then(data=>{
        ytdl(url,{quality:data.highestaudio}).on('progress',(c,td,tdl)=>{event.sender.send('testreply',"正在下載:"+info.title+"的音效檔:"+Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream('temp.mp4')).on('close',()=>{
          ytdl(url,{quality:info.itag}).on('progress',(c,td,tdl)=>{event.sender.send('testreply',"正在下載:"+info.title+info.type+":"+Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream('temp.mp3')).on('close',()=>{
            event.sender.send('testreply', info.title+info.type+' 下載完成');
            ffmpeg()
            .addInput('temp.mp4')
            .addInput('temp.mp3')
            .saveToFile(file+".mp4")
            .on('progress',(progress)=>{
              console.log(info.title+':'+Math.floor(progress.percent)+"%")
              event.sender.send('testreply',info.title+'的轉檔進度:'+Math.floor(progress.percent)+"%")
            })
            .on('end',()=>{
              event.sender.send('testreply',info.title+".mp4已下載完成")
                fs.unlink('temp.mp4',(err)=>{})
                fs.unlink('temp.mp3',(err)=>{})
            });
          })
        })
      })
        break;
      default:
        getbest(url).then(data=>{
          ytdl(url,{quality:data.highestaudio}).on('progress',(c,td,tdl)=>{event.sender.send(Math.floor((td/tdl)*100)+"%")}).pipe(fs.createWriteStream(file+'.mp3')).on('close',()=>{
            event.sender.send('testreply', info.title+'.mp3 下載完成');
          })})
        break;
    }
  }
);
ipcMain.on('choose',(event,path)=>{
  dialog.showOpenDialog({
    title:"選擇下載路徑",
    defaultPath:path,
    properties: ['openFile', 'openDirectory']
  }).then(newpath=>{
    if (!newpath.canceled) {
      event.sender.send('path',newpath.filePaths[0])
    }else{
      return
    }
  })
})