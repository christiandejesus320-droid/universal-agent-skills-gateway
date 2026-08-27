# WebXR & Spatial Interaction / WebXR e interacción espacial

WebXR debe activarse sólo cuando la presencia inmersiva sea parte del objetivo. La [especificación WebXR del W3C][1] define interfaces para experiencias VR y AR; no elimina la necesidad de diseñar una versión normal de pantalla.

## Session contract / Contrato de sesión

```text
feature detect
  → request permission through browser affordance
  → choose immersive-vr, immersive-ar or inline
  → choose reference space
  → bind input sources
  → render frame
  → exit cleanly
```

No iniciar una sesión inmersiva automáticamente. Explicar qué ocurrirá antes de solicitar permisos.

## Comfort rules / Confort

Evitar aceleraciones de cámara no solicitadas, horizonte inestable, zoom agresivo, locomoción rápida y cambios bruscos de escala. Si existe movimiento espacial, permitir pausa y salida visible. La versión inline debe conservar el contenido esencial.

## Inputs

Diseñar para mouse, touch, teclado, controllers, hands o ausencia de sensores. No depender de una sola entrada. Mostrar foco, estado de tracking y pérdida de sesión de forma comprensible.

## Spatial UI

La profundidad debe tener una función: ordenar, señalar, separar o permitir manipulación. No colocar texto pequeño flotando en el espacio. Mantener una capa de lectura accesible y una ruta de salida.

## Validation

```yaml
checks:
  - no permission before intent
  - inline mode works
  - exit is visible
  - keyboard or touch fallback exists
  - reduced motion is respected
  - tracking loss is understandable
  - content remains legible
```

[1]: https://www.w3.org/TR/webxr/ "W3C WebXR Device API"
[2]: https://immersiveweb.dev/ "Immersive Web Developer Resources"
