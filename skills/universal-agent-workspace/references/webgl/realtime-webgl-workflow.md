# Real-time WebGL / WebGPU Workflow

Esta referencia amplía la skill para crear páginas web y experiencias de interfaz con Canvas, WebGL, GLSL, WebGPU, Three.js, TSL, shaders y motion en tiempo real. **No reemplaza el prompt maestro del usuario.** Cuando una tarea sea de shaders o fondos GPU, leer primero `webgl-shader-master-prompt.md` y usar esta referencia como control de arquitectura, rendimiento y entrega.

## Cuándo activarla

Abrir esta referencia cuando la petición incluya fondos generativos, fragment shaders, Simplex o Perlin noise, fBm, domain warping, metaballs, SDF, ray marching, post-processing, Canvas 2D/GL, WebGL, WebGPU, Three.js, TSL, React Three Fiber, experiencias 3D o una interfaz web con una vista previa visual en vivo.

No activarla sólo porque una página necesite un fondo oscuro. Si el efecto no mejora comprensión, interacción, materialidad o narrativa, usar CSS o una imagen estática y documentar por qué.

## Regla de conservación

Conservar sin cambios el prompt maestro, sus fases, sus bloques GLSL, sus presets y sus reglas críticas. Esta referencia añade una capa de decisión alrededor del prompt:

```text
intención → técnica → pipeline → presupuesto → fallback → preview → evidencia
```

No copiar todo el prompt en `SKILL.md`. El núcleo sólo debe enrutar hacia esta carpeta para mantener el coste de contexto bajo.

## Fase de comprensión

Antes de producir código, fijar cinco decisiones:

| Decisión | Respuesta mínima requerida |
| --- | --- |
| Sensación | Calma, energía, poder o misterio; una sola dominante. |
| Paleta | Tres colores base y un fondo; explicar qué significa el acento. |
| Técnica | fBm, domain warp, metaballs, SDF, ray marching, post-process u otra. |
| Interacción | Ninguna, puntero, teclado, scroll o control explícito. |
| Velocidad | Lenta, media o rápida; definir el coste y el motivo. |

La composición debe tener una idea dominante por viewport. El shader no debe competir con el copy, la navegación, una acción primaria o la lectura principal.

## Pipeline obligatorio

Mantener el orden del prompt maestro:

```text
CPU / requestAnimationFrame
  → uniforms cacheados
  → vertex shader
  → rasterización
  → fragment shader
  → composición de color
  → vignette o post-processing mínimo
  → framebuffer / pantalla
```

El agente debe documentar qué sucede en CPU, qué sucede en GPU y qué parte puede degradarse cuando el dispositivo no alcanza el presupuesto.

## Reglas de rendimiento verificables

1. Obtener `getUniformLocation`, atributos y referencias de recursos una sola vez durante la inicialización; nunca dentro del render loop.
2. Usar `requestAnimationFrame` y calcular el tiempo en segundos. No crear objetos, arrays ni closures por frame sin una razón medida.
3. Ajustar el drawing buffer al tamaño real del canvas y limitar `devicePixelRatio` a un presupuesto razonable, por ejemplo `Math.min(window.devicePixelRatio, 1.5)` para una experiencia editorial de fondo.
4. Separar el tamaño CSS del tamaño del buffer. Si el efecto es atmosférico, aceptar un back buffer menor y escalarlo suavemente.
5. Mantener un solo quad fullscreen cuando no exista una razón real para geometría adicional. Batching y menos draw calls antes que complejidad visual.
6. Evitar `gl.getError()`, `getParameter()`, `readPixels()` y otras consultas síncronas dentro de producción o del loop; usarlas sólo durante diagnóstico controlado.
7. Cachear programas, VAO, buffers, texturas y uniform locations. Borrar recursos cuando ya no se usan y manejar `webglcontextlost` / `webglcontextrestored`.
8. Preferir trabajo en vertex shader cuando sea equivalente y barato. Reservar cálculos caros por píxel para el efecto que realmente lo necesita.
9. Compilar y enlazar fuera del primer frame visible cuando sea posible. Mostrar un estado de carga corto y útil, no un spinner genérico.
10. Medir en el dispositivo objetivo. Un shader que funciona en el portátil del autor no define el presupuesto de móvil.

Estas reglas se basan en las recomendaciones de MDN para WebGL, la especificación de WebGL de Khronos y la especificación WebGPU del W3C. [1] [2] [3]

## Presupuesto inicial

Usar estos valores como punto de partida, no como promesa universal:

| Nivel | Pixel ratio | Resolución de back buffer | Técnica permitida |
| --- | ---: | ---: | --- |
| Bajo | 1.0 | Hasta 1280 px en el eje mayor | Noise simple, una pasada, sin bloom. |
| Medio | 1.0–1.25 | Hasta 1600 px | fBm o domain warp moderado, una pasada de post. |
| Alto | 1.25–1.5 | Hasta el tamaño CSS | fBm complejo, SDF o ray marching medido. |

Si el efecto supera el presupuesto, reducir resolución antes de quitar accesibilidad o contenido. Si no puede degradarse de forma elegante, no debe ser el fondo de la experiencia.

## Técnica según el efecto

| Necesidad | Técnica recomendada | Evitar |
| --- | --- | --- |
| Movimiento orgánico y atmosférico | Simplex/Perlin + fBm + domain warp | Múltiples capas sin propósito. |
| Formas que se fusionan | Metaballs y SDF con smooth-min | Ray marching cuando sólo se necesitan blobs 2D. |
| Objeto volumétrico o esfera líquida | SDF + ray marching medido | 64 pasos por defecto en todos los móviles. |
| Textura viva sobre una superficie | fBm o TSL nodal | Reescribir shaders de Three.js con reemplazos frágiles. |
| Post-processing sutil | Vignette, gamma y un único ajuste semántico | Bloom y chromatic aberration por moda. |
| Escena 3D completa | Three.js / WebGPU / TSL según target | WebGL puro si sólo se necesita una imagen de fondo. |

Three.js TSL puede construir una representación de shader orientada a nodos y generar salidas para WebGL y WebGPU, con optimizaciones y tree-shaking. Usarlo cuando se necesite compartir materiales, cambiar backend o mantener una escena compleja; para un solo fondo fullscreen, WebGL directo puede ser más pequeño y explícito. [4]

## Arquitectura mínima de una página real

Toda entrega debe incluir una vista previa funcional en el mismo artefacto y estas piezas:

```text
canvas
fallback estático o CSS
controles sólo si ayudan a entender el efecto
estado de carga
estado de WebGL no disponible
estado de contexto perdido
soporte prefers-reduced-motion
```

El control panel debe ser pequeño y realista: una superficie secundaria, no el protagonista. Mostrar únicamente los parámetros que el usuario puede comprender, por ejemplo velocidad, escala y distorsión. No convertir cada uniform en un slider.

La página debe funcionar sin que el usuario tenga que leer el shader. La explicación técnica va debajo o en un panel de referencia; la experiencia principal debe poder juzgarse en movimiento y también con la animación pausada.

## Contrato de preview

Antes de entregar, verificar:

```yaml
preview: visible in the same artifact
technique: documented
fallback: available
reduced_motion: available
keyboard_or_pointer: documented when interactive
uniforms: cached before loop
resize: tested
context_loss: handled or explicitly documented
performance: measured on target tier
accessibility: readable without color or motion alone
```

## WebGL y WebGPU

WebGL es el camino compatible cuando se necesita un contexto Canvas basado en OpenGL ES y un shader GLSL directo. WebGPU expone un modelo más moderno de render y compute, con `GPUAdapter`, `GPUDevice`, buffers, texturas, command buffers y módulos de shader; no debe tratarse como un reemplazo textual de WebGL. [2] [3]

Para WebGPU, separar adapter, device, queue, pipeline y recursos. Validar errores de creación y comandos. Definir fallback a WebGL o a una imagen estática antes de empezar la escena. No esconder la ausencia de WebGPU detrás de una pantalla vacía.

## Entrega y documentación

Explicar primero el efecto y su propósito. Después documentar el pipeline, los uniforms, el presupuesto, el fallback, la compatibilidad y las decisiones descartadas. No entregar sólo un bloque enorme de GLSL.

Para cada demo guardar:

```text
examples/webgl/<nombre>/index.html
examples/webgl/<nombre>/README.md
examples/webgl/<nombre>/preview.png
```

El README de la demo debe responder qué se ve, qué técnica lo produce, cómo se cambia, qué dispositivos se probaron y qué ocurre si la GPU no está disponible.

## Fuentes

[1]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices "MDN WebGL best practices"
[2]: https://registry.khronos.org/webgl/specs/latest/1.0/ "Khronos WebGL Specification"
[3]: https://www.w3.org/TR/webgpu/ "W3C WebGPU Candidate Recommendation Draft"
[4]: https://threejs.org/docs/TSL.html "Three.js TSL documentation"
[5]: https://iquilezles.org/articles/warp/ "Inigo Quilez, Domain Warping"
