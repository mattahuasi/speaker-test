# Speaker Test

Speaker Test es una aplicación web sencilla para probar el canal izquierdo, el derecho o ambos canales de audio de forma independiente. Está pensada para verificar bocinas, audífonos o sistemas de sonido desde el navegador, sin instalar nada.

## Sitio en linea

Puedes visitar la version publicada aquí:

https://audio-speaker-test.vercel.app/

## Características

- Prueba del canal izquierdo
- Prueba del canal derecho
- Reproducción en ambos canales
- Cambio de tema claro y oscuro
- Auto-test secuencial de canales
- Diseño responsivo para móvil y escritorio
- Soporte para instalación como PWA

## Estructura del proyecto

```text
speaker-test/
├── index.html
├── favicon.ico
├── icon.svg
├── apple-touch-icon.png
├── og-image.png
├── site.webmanifest
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Uso

1. Abre `index.html` en tu navegador.
2. Pulsa **Left**, **Right** o **Both channels** para reproducir el audio.
3. Usa **Auto-test all channels** para escuchar los canales en secuencia.
4. Cambia entre tema claro y oscuro con el botón superior.

## Archivos de recursos

- `favicon.ico`: icono del sitio para pestañas del navegador.
- `icon.svg`: icono vectorial principal.
- `apple-touch-icon.png`: icono para dispositivos Apple.
- `og-image.png`: imagen para compartir en redes sociales.
- `site.webmanifest`: configuración para instalación como PWA.

## Notas

- El proyecto está construido con HTML, CSS y JavaScript puro.
- No requiere dependencias externas.
- Para una mejor experiencia, prueba con audífonos o altavoces estéreo.
