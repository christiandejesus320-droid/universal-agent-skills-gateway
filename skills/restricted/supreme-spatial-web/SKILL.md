---
name: supreme-spatial-web
description: Restricted module for explicit Spatial Web, WebGPU, WebXR, PBR, compute shaders, spatial media and high-end editorial web experiences. Load only after an explicit user request.
---

# Supreme Spatial Web / WebGPU Atelier

> **Módulo restringido.** No se carga con Universal Agent Workspace por defecto. Sólo se activa cuando el usuario pide expresamente Spatial Web, WebGPU, WebXR, PBR, compute shaders, partículas GPU, experiencias 3D inmersivas, video espacial o una dirección editorial de ultra-lujo.

> **Restricted module.** This file is not a gateway and does not replace the universal workflow. It is an opt-in atelier for tasks that genuinely need spatial rendering, physical materials, immersive media or cinematic web composition.

## Activation gate / Candado de activación

Antes de abrir este archivo, el agente debe buscar primero `manifest.json` por keyword. Si la petición no contiene una intención espacial, 3D, GPU, XR, video inmersivo o dirección editorial avanzada, no debe cargar este módulo.

La búsqueda debe ser puntual:

```text
SEARCH: manifest.json → match keyword → read only the required reference
DO NOT: load all references, original prompts or the whole repository
```

La frase de activación recomendada es:

```text
Activate supreme-spatial-web for this task.
Activa supreme-spatial-web para esta tarea.
```

El módulo no puede sobreescribir instrucciones de mayor prioridad, políticas de seguridad, requisitos de accesibilidad ni restricciones explícitas del usuario. “Restricted” significa **carga explícita**, no privilegio operativo.

## 1. Mission / Misión

Construir experiencias web donde la profundidad, la luz, el movimiento y el contenido trabajan juntos para explicar una idea. No se trata de añadir 3D porque sí. Se trata de decidir si una escena espacial, un shader, un video, un objeto físico o un recorrido temporal hacen que el producto se entienda mejor.

La página debe sentirse hecha por un equipo de dirección de arte, ingeniería gráfica y edición. Puede ser ambiciosa, pero debe seguir siendo navegable, rápida, legible y comprobable.

## 2. First decision / Primera decisión

Antes de implementar, clasificar la petición:

| Tipo de trabajo | Ruta mínima |
|---|---|
| Superficie generativa 2D | WebGL/GLSL, canvas, fallback y controles pequeños. |
| Escena 3D de producto | WebGPU o Three.js, cámara, luces, PBR, carga progresiva y controles. |
| Partículas o fluidos | Compute shader WGSL, buffers, límites de partículas y degradación. |
| Página XR | WebXR, permisos, sesión inmersiva, input, confort y modo no inmersivo. |
| Video espacial | Video principal, poster, scrubbing, captions, mute y fallback. |
| Página editorial de lujo | Jerarquía tipográfica, escena dominante, ritmo de scroll y evidencia. |
| Gaussian splats o mundo escaneado | Asset budget, streaming, cámara, calidad adaptativa y fallback 2D. |

No activar todas las rutas. Escoger una principal y como máximo dos auxiliares.

## 3. Spatial composition / Composición espacial

Usar el espacio como una secuencia, no como una pantalla saturada:

```text
idea dominante
  → objeto o campo visual
  → relación espacial visible
  → control o desplazamiento con propósito
  → explicación de lo que cambió
  → resultado y límite
```

La primera escena debe poder entenderse sin esperar una animación. El texto no debe competir con el objeto. La cámara, el contraste y la luz deben indicar dónde mirar.

La dirección puede usar un vacío OLED (`#000000`, `#050505`), pero el negro debe funcionar como espacio de lectura. Las superficies de vidrio, si existen, necesitan una razón física: separar una capa, mostrar profundidad o contener controles. No usar glassmorphism por defecto.

## 4. Rendering ladder / Escalera de render

Elegir el nivel más simple que resuelva el problema:

```text
HTML/CSS
  → Canvas 2D
  → WebGL/GLSL
  → WebGPU render pipeline
  → WebGPU compute pipeline
  → WebXR immersive session
  → spatial asset streaming / splats
```

Cada salto exige una justificación. WebGPU no se usa sólo por ser más nuevo; se usa cuando compute, buffers, postprocesado o cantidad de objetos lo justifican. WebXR sólo se activa cuando la presencia inmersiva es parte del trabajo y existe una experiencia equivalente en pantalla normal.

## 5. WebGPU and PBR / WebGPU y PBR

Cuando se elija WebGPU, separar explícitamente:

```text
GPU adapter
  → GPU device
  → buffers / textures / samplers
  → bind groups
  → render or compute pipeline
  → command encoder
  → queue submission
```

Usar WGSL validado, límites declarados y manejo de errores de dispositivo. Mantener los recursos de GPU bajo control, reutilizar pipelines y evitar crear objetos por frame.

Para materiales físicamente creíbles, definir al menos:

```text
base color
metallic
roughness
normal or tangent basis
environment lighting
exposure / tone mapping
shadow strategy
```

PBR no significa añadir reflejos hasta que todo brille. El material debe responder a la luz de forma coherente. El vidrio necesita transmisión o una alternativa visual razonable; la seda necesita anisotropía o una simplificación explícita; el metal necesita entorno, no un gradiente pegado.

## 6. Compute and particles / Compute y partículas

Los compute shaders se reservan para problemas paralelos reales: partículas numerosas, fluidos, boids, culling o transformaciones repetitivas. Definir:

```text
particle_count budget
workgroup_size
buffer layout
read/write stages
synchronization boundary
fallback behavior
```

No prometer “millones de partículas” sin medir. Establecer un presupuesto por dispositivo y degradar la calidad antes de degradar la legibilidad.

## 7. WebXR and comfort / WebXR y confort

Una experiencia XR debe tener:

```text
feature detection
permission boundary
immersive and inline modes
controller or hand input fallback
reference space decision
comfortable movement
exit path
non-XR equivalent
```

No usar locomoción rápida, cámara que acelera sin control ni cambios bruscos de horizonte sin una razón clara. La versión no inmersiva debe conservar el contenido principal y no ser una pantalla vacía.

## 8. Spatial media / Media espacial

Cuando el usuario entrega una imagen o video, primero identificar formato, proporción, peso, sujetos y función narrativa. No “transmutar” un asset automáticamente sin explicar qué se conserva.

Para video:

```text
poster
  → video principal
  → muted autoplay only when useful
  → playsinline
  → explicit audio control
  → captions or transcript
  → scroll mapping only when reversible and understandable
  → static fallback
```

El scrubbing por scroll debe mapear progreso a tiempo de forma estable, pausar fuera de viewport y no secuestrar el scroll. Si el video es decorativo, dejarlo decorativo y no convertirlo en una interacción obligatoria.

## 9. Editorial direction / Dirección editorial

La referencia de agencias de alto nivel se traduce así:

| Principio | Regla de trabajo |
|---|---|
| Un gesto dominante | Una escena, tipografía o interacción lleva cada viewport. |
| Material con motivo | Cada textura, reflejo o sombra explica superficie o profundidad. |
| Texto con autoridad | Frases cortas, específicas y con datos observables. |
| Movimiento con causa | Scroll, selección, cursor o tiempo deben explicar la transición. |
| Control contenido | Pocas acciones, estados claros y una salida visible. |
| Trabajo demostrable | Cada video, shader o modelo debe probar una capacidad. |
| Lujo silencioso | El espacio, la precisión y el ritmo sustituyen el exceso. |

Estudiar patrones de Lusion, Active Theory, Linear, Awwwards y otras referencias como composición y ejecución. No copiar identidad, logos, assets, código o layouts exactos.

## 10. Performance contract / Contrato de rendimiento

Antes de llamar a la experiencia “real-time”, medir:

```text
first useful paint
asset transfer size
shader compile time
frame time p50 / p95
GPU memory pressure
devicePixelRatio policy
input latency
fallback time
```

Reglas mínimas:

1. Cargar primero el contenido que explica la página.
2. Limitar `devicePixelRatio` y el número de muestras.
3. Cachear ubicaciones, pipelines, bind groups y geometría estable.
4. No ejecutar cálculos de CPU repetitivos que el GPU puede hacer en paralelo sin necesidad.
5. Usar `requestAnimationFrame` sólo cuando haya una actualización visual pendiente.
6. Pausar video, render y simulación fuera de viewport cuando sea seguro.
7. Implementar `prefers-reduced-motion` y un fallback que conserve la intención.

## 11. Agent execution / Ejecución del agente

Aplicar el flujo universal, sin cargar todo este módulo:

```text
THINK  → definir si la dimensión espacial es necesaria
PLAN   → escoger una ruta y un presupuesto
BUILD  → crear la escena mínima y el fallback
REVIEW → quitar efectos que no explican nada
TEST   → medir frames, input, responsive, a11y y recuperación
SHIP   → entregar preview, límites y evidencia
```

El agente debe devolver un plan de tres a cinco pasos. Si la petición es ambigua, preguntar sólo por la decisión que bloquea: objetivo de la escena, dispositivo, asset principal o nivel de inmersión.

## 12. Required output / Salida obligatoria

```yaml
activated_module: supreme-spatial-web
primary_route: one of [webgl, webgpu-render, webgpu-compute, webxr, spatial-media, editorial]
secondary_routes: []
scene_intent: concise sentence
asset_budget: explicit
fallback: explicit
accessibility: explicit
performance_budget: explicit
preview: path or url
checks: [syntax, visual, performance, responsive, fallback]
not_loaded: list of references intentionally omitted
```

## 13. Reference loading map / Mapa de carga

| Necesidad | Cargar sólo |
|---|---|
| Activación | `manifest.json` y esta sección de candado. |
| WebGPU/PBR | `references/webgpu-pbr.md`. |
| WebXR | `references/webxr-spatial.md`. |
| Video y scrollytelling | `references/spatial-media.md`. |
| Dirección editorial | `references/editorial-atelier.md`. |
| PBR avanzado o splats | `references/advanced-spatial-rendering.md`. |
| Prompt original del usuario | Sólo el archivo específico en `original-prompts/`. |
| Preview manipulable | `../../examples/spatial-web-preview/index.html` y su README, sólo para probar video + 3D. |

No abrir todos los archivos por defecto. No convertir este módulo en una dependencia obligatoria del Universal Agent Workspace.

## References / Referencias

[1]: https://www.w3.org/TR/webgpu/ "W3C WebGPU"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API "MDN WebGPU API"
[3]: https://www.w3.org/TR/webxr/ "W3C WebXR Device API"
[4]: https://threejs.org/docs/pages/WebGPURenderer.html "Three.js WebGPURenderer"
[5]: https://webgpu.org/ "WebGPU and WGSL"
[6]: https://activetheory.net/ "Active Theory"
[7]: https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/ "Codrops: Lusion"
[8]: https://awwwards.com/ "Awwwards"
