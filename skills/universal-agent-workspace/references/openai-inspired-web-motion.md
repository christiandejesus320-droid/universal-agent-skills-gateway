# Editorial Product Web & Motion / Web editorial de producto y motion

Esta referencia traduce patrones observables en páginas públicas de OpenAI a reglas neutrales para Universal Agent Workspace. **No es una copia de OpenAI.** No reutiliza logos, textos, videos, activos, código, tipografía propietaria ni layouts exactos. Toma decisiones de composición, relación entre demo y explicación, controles audiovisuales, ritmo de scroll y claridad de producto.

## Activar esta referencia

Abrirla cuando la petición incluya una página institucional de alto nivel, una página de producto, una landing de tecnología, una demostración de video, una experiencia con audio, una narrativa editorial larga o una interfaz visual que deba sentirse real y no genérica.

## Dirección visual

La página debe sentirse como un producto que funciona, no como una colección de efectos. El fondo puede ser negro u oscuro, pero el negro debe crear espacio para leer y observar. La autoridad viene de la escala tipográfica, el ritmo y la evidencia; no de glow, gradientes decorativos, pill badges o una pared de tarjetas.

Usar una sola idea dominante por viewport. En la entrada, escoger una de estas formas según el objetivo:

| Objetivo | Entrada recomendada |
| --- | --- |
| Hacer que la persona empiece | Pregunta o intención centrada, campo de entrada y ejemplos reconocibles. |
| Presentar un producto | Frase grande, una palabra acentuada, explicación breve y dos acciones distintas. |
| Explicar una investigación | Título, categoría, fecha, lectura estimada y un medio que pruebe la idea. |
| Mostrar una capacidad audiovisual | Video protagonista, prompt o contexto visible y rail corto de variaciones. |
| Enseñar una herramienta | Preview operativa con controles mínimos, estado y resultado. |

## Composición editorial

La estructura recomendada no es un dashboard. Es una secuencia de lectura:

```text
navegación estable
  → promesa o pregunta
  → prueba visual
  → explicación concreta
  → flujos reconocibles
  → historias o casos
  → recursos
  → siguiente acción
```

La pieza principal puede ocupar más espacio, pero debe estar acompañada por una pieza secundaria de menor densidad. El tamaño comunica jerarquía. No dar el mismo peso a todo.

Después de la entrada, alternar una demostración amplia con un bloque de lectura más estrecho. La lectura debe tener aire y una anchura que no obligue a recorrer líneas demasiado largas. La página puede ser extensa si cada sección responde una pregunta distinta.

## Tipografía y copy

Usar un display grande sólo para la idea principal. El cuerpo debe ser tranquilo y legible. Las etiquetas de categoría, fecha, duración y estado deben ser pequeñas, pero nunca tan pequeñas que parezcan metadatos ocultos.

Escribir frases concretas. Evitar claims abstractos como “revolucionario”, “mágico” o “de otro nivel” si no se muestra una prueba. Sustituirlos por el comportamiento que la persona puede observar.

Un buen bloque responde:

```text
qué es
qué cambia
cómo se prueba
qué límite existe
qué puede hacer la persona después
```

## Video como evidencia

Un video no debe existir sólo para llenar el hero. Cada clip debe demostrar una capacidad, una transformación o un estado. La pieza debe tener contexto cercano: título, prompt, duración, categoría o una frase que diga qué mirar.

Cuando hay varias escenas, usar un rail lateral o inferior de miniaturas. Mantener una escena principal grande y un número pequeño de alternativas. Las miniaturas son una forma de navegación de contenido, no un grid de cards.

Para video web:

```text
poster útil
  → muted autoplay sólo cuando aporta comprensión
  → playsinline
  → loop sólo si la repetición no confunde
  → control de sonido explícito
  → pausa con prefers-reduced-motion
  → fallback estático
  → texto alternativo o explicación equivalente
```

No hacer autoplay con audio. Si el sonido es importante, mostrar play, mute, duración y una frase que explique su función. Si el navegador bloquea el video, la página debe seguir teniendo sentido.

## Audio y lectura

Un artículo largo puede incluir un control “Escuchar el artículo” con play, duración, progreso y una acción de compartir. El control debe estar separado de la navegación y no debe parecer un reproductor musical completo si sólo acompaña la lectura.

La transcripción y el texto escrito siguen siendo la fuente de comprensión. El audio es una segunda ruta, no el único canal. No esconder información importante sólo dentro del video o del sonido.

## Motion y scroll

Usar movimiento para introducir una relación entre elementos, revelar una transición o mostrar un cambio de estado. El scroll puede dosificar la narrativa, pero no debe convertir la página en un túnel sin control.

Reglas:

1. El primer frame debe ser comprensible antes de cualquier transición.
2. La entrada de un elemento debe tener una causa visible: scroll, selección, reproducción o cambio de estado.
3. Las escenas relacionadas pueden compartir continuidad; las no relacionadas deben tener un corte claro.
4. El movimiento debe poder pausarse o reducirse.
5. La velocidad debe favorecer observación y lectura, no retención artificial.
6. No usar parallax, blur o zoom si no aclaran profundidad, jerarquía o relación.

## Flujos de producto

Mostrar tareas reales en lugar de una lista de features. Para una skill o herramienta de agentes, ejemplos válidos son:

```text
petición → alcance → contexto mínimo → ejecución → resultado → evidencia
captura → prototipo → interacción → revisión
URL → análisis → hallazgo → micro-cambio → prueba
```

Cada flujo debe tener una acción inicial clara y un resultado que pueda juzgarse. No presentar diez capacidades sin mostrar cuándo se usan.

## Controles y estados

Los controles principales pueden ser grandes cuando invitan a comenzar, pero deben existir sólo dos acciones principales como máximo por sección. Los controles secundarios deben ser discretos.

Definir siempre:

```text
idle, hover, focus, active, loading, muted, playing, paused,
reduced-motion, unavailable, error, complete
```

Los estados deben decir qué pasó. Un botón con un ícono sin etiqueta no es suficiente para audio, video, publicación o acciones destructivas.

## Accesibilidad y rendimiento

Respetar teclado, foco visible, contraste, captions o transcripción, `prefers-reduced-motion`, `playsinline`, fallback estático y carga diferida. No cargar todos los videos del documento al entrar. Cargar el medio principal y preparar el resto cuando se acerque al viewport o cuando la persona lo seleccione.

Medir el peso de posters, videos, fuentes y scripts. Un hero audiovisual no justifica que el primer contenido útil tarde demasiado. El contenido debe poder leerse antes de que termine de cargar el medio.

## Adaptación a Universal Agent Workspace

Cuando esta referencia se use dentro de la skill:

```text
THINK: definir la intención del viewport
PLAN: escoger un medio y una acción principal
BUILD: construir la prueba con estados y fallback
REVIEW: quitar efectos que no explican nada
TEST: probar carga, audio, teclado, reduced motion y móvil
SHIP: documentar qué evidencia demuestra el resultado
```

La dirección final debe sentirse humana, técnica y segura. Puede ser sobria, cinematográfica o generativa, pero nunca debe parecer una plantilla automática de IA.

## Fuentes consultadas

[1]: https://openai.com/es-419/ "OpenAI | Research & Deployment"
[2]: https://openai.com/es-419/index/sora-2/ "Llegó Sora 2 | OpenAI"
[3]: https://openai.com/es-419/business/solutions/design/ "ChatGPT Work para equipos de diseño | OpenAI"
[4]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "MDN video element"
[5]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion "MDN prefers-reduced-motion"
