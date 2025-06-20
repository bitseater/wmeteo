const { app, BrowserWindow, Menu } = require('electron');

function crearVentanaPrincipal() {
  // Elimina el menú de la aplicación
  Menu.setApplicationMenu(null);

  const ventana = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  ventana.loadFile('src/index.html');
}

app.whenReady().then(crearVentanaPrincipal);