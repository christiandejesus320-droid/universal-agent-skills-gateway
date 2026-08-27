# Realtime Surface

Esta demo prueba una capacidad concreta de Universal Agent Workspace: construir una superficie visual en tiempo real sin depender de imágenes, videos, Three.js ni una API externa.

La página usa un canvas WebGL, un vertex shader mínimo y un fragment shader con noise, fBm, distorsión de dominio, composición de color y vignette. El movimiento es lento por diseño. Los controles de velocidad, escala y distorsión están presentes sólo porque ayudan a entender qué cambia.

## Cómo probarla

Abre `index.html` directamente en un navegador moderno o sírvela con cualquier servidor estático:

```bash
python3 -m http.server 4173 --directory examples/webgl/realtime-surface
```

Después visita `http://localhost:4173`.

## Qué comprobar

La demo debe renderizar una superficie oscura y azulada que se mueve de manera lenta. El panel inferior derecho modifica tres uniforms sin crear referencias dentro del loop. El tamaño del drawing buffer está limitado por `devicePixelRatio` para evitar que una pantalla de alta densidad destruya el presupuesto de una experiencia de fondo.

El estado inferior izquierdo informa si la superficie está lista, si WebGL no está disponible o si el contexto de GPU se perdió y luego se restauró. La página sigue siendo legible sin necesitar color, glow o una animación constante.

## Reglas verificadas

| Regla | Implementación |
| --- | --- |
| Uniforms cacheados | Todas las ubicaciones se obtienen antes de `requestAnimationFrame`. |
| Resize controlado | `devicePixelRatio` se limita a `1.5`. |
| Sin dependencias | Sólo HTML, CSS, JavaScript y WebGL. |
| Fallback | El documento informa cuando WebGL no está disponible. |
| Context loss | Se escuchan `webglcontextlost` y `webglcontextrestored`. |
| Vista previa | El artefacto es ejecutable y visible, no sólo un bloque de código. |
| Motion con propósito | La animación es lenta y los sliders representan uniforms reales. |

Esta demo no pretende ser un producto final ni una copia de Anthropic u OpenAI. Es una prueba pequeña para demostrar que la skill puede llevar una intención visual a una página funcional, medible y mantenible.
