# Spatial Media / Media espacial

El video y el audio deben demostrar algo. No son una decoración automática de la portada.

## Media sequence / Secuencia de media

```text
intent
  → poster
  → primary media
  → caption / prompt / context
  → optional variants
  → explanation
  → fallback
```

## Video modes

| Modo | Cuándo usarlo | Reglas |
| --- | --- | --- |
| Ambient | El movimiento sólo crea atmósfera | muted, loop, playsinline, pause fuera de viewport. |
| Evidence | El video prueba una capacidad | poster, título, contexto, controles y estado. |
| Scrub | El usuario explora una transformación | mapear scroll a tiempo, reversible, pausible y con fallback. |
| Spatial texture | El video se usa como textura | controlar UV, contraste, memoria y alternativa 2D. |

No descargar todos los videos al entrar. Cargar poster primero, después el medio principal y las variantes bajo selección o proximidad.

## Audio

```text
play
pause
mute / unmute
current time
full duration
transcript or equivalent
```

No autoplay con audio. Si el artículo ofrece escucha, el texto escrito debe seguir siendo completo. El control debe sentirse editorial, no como una aplicación musical separada.

## Scrubbing contract

```js
progress = clamp(scrollProgress, 0, 1)
media.currentTime = progress * media.duration
```

Usar `requestAnimationFrame` para agrupar actualizaciones, evitar saltos y pausar cuando no haya un cambio significativo. No secuestrar el scroll ni convertir la página en una animación imposible de abandonar.

## Spatialization

Mapear un video a una superficie 3D sólo si la deformación explica profundidad, material o transformación. Una textura sobre una cinta, esfera, nube de puntos o plano puede ser válida; la forma debe conservar un punto de lectura.

## Accessibility and fallback

```yaml
required:
  - poster
  - captions or transcript
  - keyboard focus
  - pause control
  - reduced motion behavior
  - static fallback
  - meaningful label
```

El contenido no puede desaparecer porque el navegador bloquee autoplay, el codec no sea compatible o el GPU esté deshabilitado.

## Provenance

Cuando el medio provenga de una fuente externa, conservar attribution, licencia y procedencia. No incorporar videos de terceros al repositorio sólo porque una página de referencia los utilice.
