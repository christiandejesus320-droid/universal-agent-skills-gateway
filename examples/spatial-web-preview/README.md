# Spatial Web Preview / Preview de video y 3D

Esta preview es la prueba funcional del módulo `supreme-spatial-web`.

## Qué se puede manipular

El video tiene reproducción, pausa, mute, scrub temporal, compartir y scrubbing por scroll. La capa WebGL tiene una formación de partículas que responde al cursor y permite arrastrar la escena. El video y la capa 3D viven juntos para comprobar que la experiencia no depende de una imagen estática.

## Ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 4173
```

Abrir:

```text
http://127.0.0.1:4173/examples/spatial-web-preview/index.html
```

El servidor es necesario porque el navegador puede bloquear recursos multimedia cargados desde `file://`.

## Estados cubiertos

```text
play / pause
mute / sound
manual timeline scrub
scroll to video time
pointer camera response
pointer drag
WebGL unavailable fallback
video error fallback
prefers-reduced-motion
responsive control rail
```

El video original se encuentra en `skills/restricted/supreme-spatial-web/assets/spatial-particle-hero.mp4` y fue generado como un asset original para esta demostración. La referencia de diseño se conserva separada y no se copia como contenido de terceros.
