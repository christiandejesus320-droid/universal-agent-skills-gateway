# Advanced Spatial Rendering / Render espacial avanzado

Abrir sólo cuando la petición necesite geometría procedural, SDF, ray marching, Gaussian splats, fluidos, iluminación avanzada o una escena que exceda un render 3D normal.

## Escalation rule / Regla de escalamiento

```text
CSS perspective
  → instanced geometry
  → WebGL shader
  → WebGPU render
  → WebGPU compute
  → splats or streamed spatial asset
```

Escalar sólo cuando una medición o una necesidad narrativa lo justifique. El vocabulario de “otro planeta” expresa ambición visual, no una promesa de física perfecta.

## SDF and ray marching

Definir funciones de distancia, unión, intersección, smooth minimum, normal estimation, camera ray, step limit, epsilon y máximo de iteraciones. Usar límites para evitar loops infinitos y degradar la calidad en dispositivos lentos.

## PBR and light

Separar material, entorno y exposición. Verificar que roughness y metallic no estén siendo usados como controles de color. En materiales translúcidos, documentar la aproximación si no hay transmisión física.

## Gaussian splats and scanned worlds

Tratar un asset de puntos como datos pesados: medir tamaño, compresión, sorting, streaming, memoria y cámara. Crear un poster o una versión mesh/2D que conserve el contenido esencial. No prometer soporte universal de splats.

## Adaptive quality

```yaml
quality_levels:
  low: static or lightweight fallback
  medium: reduced particles, resolution and postprocess
  high: full measured scene
switch_signals:
  - device capability
  - frame time
  - memory pressure
  - user preference
```

El cambio de calidad debe preservar composición y significado. No ocultar el hecho de que la escena se degradó si afecta a la interacción.

## Verification

```text
shader compile
frame time p50/p95
GPU memory
asset transfer
camera bounds
input latency
fallback readability
```

Una escena avanzada no está terminada hasta que puede fallar de forma elegante.
