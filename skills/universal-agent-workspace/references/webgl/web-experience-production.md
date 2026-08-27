# Realistic Web Experience / Página y app web realista

Abrir esta referencia cuando la tarea pida crear una página web, una app web, una landing editorial, una experiencia de producto, una interfaz de agente o una escena visual con Canvas/WebGL.

## Dirección

No construir una dashboard genérica ni una landing llena de efectos. Construir un lugar de trabajo que una persona pueda usar. La interfaz debe comunicar inteligencia por su orden, su respuesta y su escala; no por gradientes, glow, badges, avatares o animación permanente.

Antes de escribir componentes, definir en una frase:

```text
qué persona entra,
qué intención trae,
qué transformación debe ver,
y qué decisión debe poder tomar al salir.
```

Cada viewport debe tener una idea dominante. La navegación, los controles y el efecto visual acompañan esa idea; no compiten con ella.

## Estructura de una entrega

```text
sistema visual
  → arquitectura de información
  → layout y escala
  → estado inicial
  → interacción principal
  → estados de trabajo
  → evidencia y cierre
  → responsive y fallback
```

Separar siempre:

| Superficie | Función |
| --- | --- |
| Intención | Lo que la persona quiere hacer. |
| Contexto | Lo mínimo que necesita ver para decidir. |
| Acción | El cambio que puede iniciar. |
| Resultado | Lo que el sistema produjo. |
| Evidencia | Lo que fue comprobado y lo que falta. |

No es obligatorio convertir estas superficies en cinco columnas. Pueden aparecer como una secuencia dentro de la misma página.

## Escala y composición

Usar una grilla de 12 columnas sólo cuando ayude a ordenar. Mantener un ancho legible y evitar que una imagen o canvas ocupe toda la pantalla si no es la idea principal. Para una página editorial, empezar con estas referencias:

```text
max-width de lectura: 680–760px
max-width de trabajo: 1120–1280px
rail lateral: 240–260px sólo si la densidad lo justifica
padding desktop: 32–64px
padding móvil: 18–24px
radio editorial: 0–4px
radio de control: 8–12px sólo si mejora la interacción
```

La escala de la imagen debe responder al contenido. Una referencia visual grande no debe empujar el nombre, el propósito o la acción fuera de la primera lectura. Si la imagen necesita una explicación, mostrar primero la explicación y después la imagen.

## Sistema visual

Usar superficies `#000000`, `#09090B`, `#111113`, `#18181B` y `#27272A`, texto suave y un solo acento con significado. No usar una paleta distinta para cada sección.

Usar una tipografía display sólo para una declaración importante, una tipografía de lectura para operación diaria y monospace para valores técnicos. No convertir todo en monospace.

Preferir separación, ritmo y texto a una card. Usar una card únicamente cuando aísle una tarea, una decisión, una comparación o un contexto. El espacio vacío también es una herramienta de organización.

## Estados de producto

Definir antes de pulir:

```text
initial
ready
working
needs-input
blocked
success
error
recovering
empty
```

Cada estado debe explicar qué ocurrió, qué puede hacer la persona y qué parte del trabajo permanece. No mostrar razonamiento privado. Mostrar estados operativos útiles: entender la petición, seleccionar contexto, ejecutar, comprobar y terminar.

## Canvas, WebGL y controles

Si hay Canvas o WebGL, el canvas debe apoyar la historia. El panel de parámetros debe ser pequeño, fijo y comprensible. Mostrar sólo controles que tengan una relación visible con el resultado, por ejemplo velocidad, escala y distorsión. No exponer cada uniform.

El movimiento debe poder pausarse. Implementar `prefers-reduced-motion`, un fallback estático y un estado explícito cuando la GPU no esté disponible. Si el efecto se elimina y la página deja de entenderse, el efecto estaba cargando demasiado peso narrativo.

## Crear una app, no sólo una imagen

Una app web real necesita un flujo completo:

```text
entrada de intención
  → validación
  → estado de trabajo
  → resultado
  → evidencia
  → recuperación si falla
```

Los formularios deben tener labels visibles, foco, teclado, error junto al campo y una acción primaria clara. Las mutaciones sensibles deben explicar destino, permiso, datos usados y efecto antes de pedir confirmación.

## Preview obligatoria

Entregar una preview funcional en el mismo artefacto. No entregar sólo una captura ni sólo un fragmento de shader. La preview debe poder abrirse, manipularse y probarse sin instalar una cadena innecesaria de herramientas.

La prueba mínima debe verificar:

```yaml
visual_hierarchy: one dominant idea per viewport
scale: image and controls fit the intended reading order
interaction: primary path works with keyboard or pointer
states: initial, working, error and success are visible
responsive: desktop and mobile keep the same intention
fallback: page remains useful without WebGL or motion
performance: rendering budget is measured or bounded
```

## Fuentes de implementación

Para WebGL directo, usar la especificación de Khronos y las prácticas de MDN. Para WebGPU, usar el modelo de adapter, device, queue, pipeline y command buffers descrito por W3C. Para escenas mantenibles con WebGL/WebGPU, considerar Three.js TSL porque puede generar GLSL o WGSL y compartir nodos, uniforms y materiales. [1] [2] [3] [4]

## Fuentes

[1]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices "MDN WebGL best practices"
[2]: https://registry.khronos.org/webgl/specs/latest/1.0/ "Khronos WebGL Specification"
[3]: https://www.w3.org/TR/webgpu/ "W3C WebGPU"
[4]: https://threejs.org/docs/TSL.html "Three.js TSL"
