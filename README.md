
# WMeteo
OpenWeather en una aplicación web ligera.

## Frontend — React (Vite)

Aplicación React mínima creada con Vite y JavaScript.

## Instalación

```bash
npm install
```

Configura la clave de OpenWeather en un archivo `.env` en la raíz del proyecto:

```env
VITE_OPENWEATHER_API_KEY=tu_clave_de_openweather
```

## Desarrollo web

```bash
npm run dev
```

El servidor abrirá automáticamente el navegador en:

```text
http://localhost:5173
```

## Build web

```bash
npm run build
```

La versión compilada queda en la carpeta `dist/`.

Para revisarla localmente:

```bash
npm run preview
```

## Ejecutable de Windows

La aplicación de escritorio usa Electron. Para probar la app en una ventana de escritorio sin generar instalador:

```bash
npm run electron
```

Para reconstruir el `.exe`:

```bash
npm run dist:exe
```

Los archivos generados quedan en `release/`:

```text
release/WMeteo 0.1.0.exe
release/WMeteo Setup 0.1.0.exe
```

`WMeteo 0.1.0.exe` es la versión portable. `WMeteo Setup 0.1.0.exe` es el instalador.

La carpeta `release/` se genera automáticamente y no se versiona en Git.
