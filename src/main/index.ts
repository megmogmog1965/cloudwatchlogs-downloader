import { app, BrowserWindow, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as defaultMenu from 'electron-default-menu';
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  // const ENV = process.env.NODE_ENV || 'production';
  // const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http';
  // const PORT = parseInt(process.env.PORT || '', 10) || 3000;
  // const HOST = process.env.HOST || '127.0.0.1';

  const appUrl = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow = new BrowserWindow({ width: 1000, height: 600 });
  mainWindow.loadURL(appUrl);

  mainWindow.on('closed', () => (mainWindow = null));
  // mainWindow.maximize();

  //   installExtension(REACT_DEVELOPER_TOOLS)
  //     .then((name) => console.log(`Added Extension:  ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));

  // add menu.
  Menu.setApplicationMenu(Menu.buildFromTemplate(createMenu()));
}

function createMenu() {
  const menu = defaultMenu(app, shell);
  return menu;
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') { app.quit(); }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
