# Creative documentation and community system / Sistema de documentación creativa y comunidad

Read this reference only when a task involves WebGL, Three.js, GLSL, WebGPU, shaders, motion, immersive experiences, design case studies, creative coding or public documentation. Do not load it for ordinary product UI or a simple code fix.

## Core method / Método central

Every advanced visual technique must be documented as a small experiment with a clear purpose, visual result, implementation boundary, performance cost, fallback and verification. Do not document effects as magic. Explain what the effect helps the user understand or feel, then explain the smallest technical mechanism that produces it.

Cada técnica visual avanzada debe documentarse como un experimento pequeño con propósito, resultado visual, límite de implementación, coste de rendimiento, fallback y verificación. No documentes efectos como magia. Explica qué ayuda a entender o sentir y después el mecanismo técnico mínimo que lo produce.

Use this sequence:

```text
BRIEF → HYPOTHESIS → REFERENCE → PROTOTYPE → BREAKDOWN → OPTIMIZE → FALLBACK → VERIFY → PUBLISH
```

## Source-derived practices / Prácticas derivadas de las fuentes

| Source pattern / Patrón de fuente | Own practice / Práctica propia |
| --- | --- |
| Codrops separates tutorials, demos, case studies and curated inspiration. | Separate concept, runnable demo, implementation breakdown and lesson learned. |
| Active Theory joins story, art, technology, quality and performance. | State the narrative intent and performance bar before choosing a technical stack. |
| Awwwards combines education, collections, directory and evaluation. | Separate inspiration, learning, review and delivery; never use one aesthetic score as truth. |
| Cuberto combines UX research, product design, motion, 3D and creative development. | Validate the user flow before adding high-impact interaction. |
| Stripe publishes engineering reasoning, trade-offs, reliability and testing. | Document constraints, architecture, alternatives, verification and operational result. |
| Shadertoy is an experiment-oriented shader community, but may be protected by bot checks. | Use public demos only when accessible; isolate equations, parameters and performance; never bypass access controls. |
| Readymag uses editorial sequencing and interactive stories. | Treat typography, order, pacing and layout as part of the explanation, not as decoration. |

## Case study contract / Contrato de caso de estudio

A useful case study has: problem, audience, mission, constraint, chosen medium, rejected alternatives, prototype, implementation, performance budget, accessibility fallback, tests, result and reusable lesson. If a fact, metric or technique was not verified, label it as an assumption.

Un caso útil contiene: problema, audiencia, misión, restricción, medio elegido, alternativas descartadas, prototipo, implementación, presupuesto de rendimiento, fallback accesible, pruebas, resultado y lección reutilizable. Si un dato, métrica o técnica no fue verificado, márcalo como supuesto.

## Creative coding contract / Contrato de creative coding

For WebGL, Three.js, GLSL or WebGPU, define scene intent, camera, inputs, coordinate system, shader responsibility, asset budget, frame budget, device tiers, loading path, pointer and keyboard behavior, reduced-motion behavior, non-WebGL fallback and failure recovery. Keep the experiment independently removable.

Para WebGL, Three.js, GLSL o WebGPU define intención de escena, cámara, entradas, sistema de coordenadas, responsabilidad del shader, presupuesto de assets, frames, niveles de dispositivo, loading, puntero y teclado, reduced motion, fallback sin WebGL y recuperación de fallos. El experimento debe poder retirarse sin romper el producto.

## Motion breakdown / Desglose de motion

Describe motion by trigger, target, property, duration, easing, interruption, reduced-motion alternative and success signal. Use 120–180ms for micro feedback, 240–360ms for component transitions and 500–900ms for scene changes only when they improve comprehension. Do not hide primary content behind an animation.

Describe motion por trigger, objetivo, propiedad, duración, easing, interrupción, alternativa reduced motion y señal de éxito. Usa 120–180ms para feedback micro, 240–360ms para componentes y 500–900ms para escenas sólo si mejoran comprensión. No escondas contenido principal detrás de una animación.

## Public learning loop / Bucle público de aprendizaje

When publishing a tutorial or internal reference, include a small runnable example, expected output, prerequisites, one failure mode, one performance note, one accessibility note and a concise conclusion. Invite reproducible feedback, not vague opinions. Keep the source link, version and access date.

Al publicar un tutorial o referencia interna, incluye un ejemplo pequeño ejecutable, salida esperada, prerequisitos, un fallo posible, una nota de rendimiento, una nota de accesibilidad y una conclusión breve. Pide feedback reproducible, no opiniones vagas. Conserva enlace, versión y fecha de acceso.

## Discovery and research discipline / Disciplina de descubrimiento

Search by exact blocker and verify from primary documentation. Use a named reference for inspiration, but do not copy a studio's identity, wording, layout or protected assets. Extract principles and test them against the product's mission, audience, accessibility and performance budget.

Busca el bloqueo exacto y verifica documentación primaria. Usa una referencia nombrada para inspirarte, pero no copies identidad, redacción, layout ni assets protegidos. Extrae principios y pruébalos contra misión, audiencia, accesibilidad y presupuesto de rendimiento.

## Delivery / Entrega

The final artifact should state what was learned, what was implemented, what was measured, what remains uncertain and how to reproduce the result. Stop when the requested acceptance criteria pass; do not add a gallery, tutorial or extra experiment unless requested.
