const menuTemplate = require('./src/common/menu-template')
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const url = require('url')
const path = require('path')

let window

function createWindow() {
   window = new BrowserWindow({
      webPreferences: {
         nodeIntegration: true
      }
   })
   window.loadURL(url.format({
      pathname: path.join(__dirname, './src/home-screen/home.html'),
      protocol: 'file:',
      slashes: true
   }))
}
//set menu
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
app.on('ready', createWindow)
