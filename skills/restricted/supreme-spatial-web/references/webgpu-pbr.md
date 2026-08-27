# WebGPU, WGSL & PBR / WebGPU, WGSL y PBR

## Device path / Ruta del dispositivo

```text
navigator.gpu
  → requestAdapter
  → requestDevice
  → configure canvas
  → shader modules
  → bind groups
  → render or compute pipeline
  → command encoder
  → queue.submit
```

WebGPU expone GPU para render y cómputo general. Su arquitectura debe tratarse como una frontera validada entre la aplicación y el hardware, no como un canvas mágico. Consultar [W3C WebGPU][1] y [MDN WebGPU][2] para compatibilidad, errores y límites.

## Render pipeline

Separar vertex y fragment stages. Mantener buffers estables, reutilizar pipelines y declarar formatos y usos. La escena debe poder bajar resolución, muestras, partículas o postprocesado sin perder su estructura.

## Compute pipeline

Usarlo para trabajo paralelo real: partículas, boids, fluidos, culling, skinning o postprocesado. Definir workgroup size, layout de buffers, barreras y límites antes de escribir WGSL.

## PBR contract

```text
baseColor
metallic
roughness
normal
ambient / environment lighting
shadow model
tonemapping
exposure
```

El realismo físico requiere consistencia de luz y material, no brillo indiscriminado. Si no existe environment mapping, usar una aproximación declarada. Si no hay ray tracing, no afirmar que existe ray tracing.

## Error and fallback

Manejar `uncapturederror`, `device.lost`, adapter inexistente, contexto no disponible y límites insuficientes. Producir una versión WebGL, Canvas 2D, imagen estática o HTML semántico según el objetivo.

## Presupuesto

```yaml
mobile:
  target_frame_ms: 20
  dpr_max: 1.25
  particle_budget: conservative
desktop:
  target_frame_ms: 16.67
  dpr_max: 1.5
  particle_budget: measured
high_end:
  target_frame_ms: 16.67
  dpr_max: 2
  particle_budget: benchmarked
```

Los valores son presupuestos iniciales, no garantías. Medir p50 y p95.

[1]: https://www.w3.org/TR/webgpu/ "W3C WebGPU"
[2]: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API "MDN WebGPU API"
