
import { app, BrowserWindow, Menu, MenuItemConstructorOptions, screen } from "electron";
import { format } from 'url';
import { join } from 'path';
import * as isDev from 'electron-is-dev';
import './ipcHandlers';

let mainWindow;

const uri = isDev
  ? format({
      pathname: "localhost:3000",
      protocol: "http:",
      slashes: true
    })
  : format({
      pathname: join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true
    });

app.on("ready", function() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  //create new window
  mainWindow = new BrowserWindow({
    width: width / 2,
    height: height
  });

  //Load HTML into window
  mainWindow.loadURL(uri);

  //Quit App when closed
  mainWindow.on("closed", function() {
    app.quit();
  });
  //Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert the menu
  Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "First_thing"
      },
      {
        label: "Second"
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "Options",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall"
      }
    ]
  }
];

//if mac, add empty object to menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

//Add developer tools item if not in prod
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
