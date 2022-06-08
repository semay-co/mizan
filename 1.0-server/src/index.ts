import { app } from 'electron'
import { createCapacitorElectronApp } from '@capacitor-community/electron'
//import server from './server'
import dotenv from 'dotenv-flow'

dotenv.config({
  path: __dirname + '/electron/.env.local',
})

const cap = createCapacitorElectronApp({
  mainWindow: {
    windowOptions: {
      minHeight: 400,
      minWidth: 500,
      // fullscreen: true,
      darkTheme: true,
      center: true,
      // kiosk: true,
      webPreferences: {
        nodeIntegration: true,
      },
    },
  },
})

app.on('ready', () => {
  cap.init()
  cap.getMainWindow().setMenu(null)
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (cap.getMainWindow().isDestroyed()) cap.init()
})

//server()
