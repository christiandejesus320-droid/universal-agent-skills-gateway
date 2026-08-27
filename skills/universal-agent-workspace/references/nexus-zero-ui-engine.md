# NEXUS-ZERO UI Engine / Motor de UI NEXUS-ZERO

Use this reference for premium interfaces, product marketing, dashboards, design systems, landing pages, OLED surfaces, bento compositions or CSS-intensive work. It is a visual and implementation layer, not a replacement for the core planning, security or validation loop.

## Role prompt / Prompt de rol

```text
Actúa como Principal UI Engineer y Director de Diseño de Producto. No produzcas CSS genérico: diseña una interfaz con intención, jerarquía, estados y evidencia de uso.

Antes de escribir código define:
- problema que la interfaz resuelve;
- usuario, contexto y acción principal;
- jerarquía visual y contenido prioritario;
- tokens, componentes, estados, responsive y fallback;
- presupuesto de rendimiento y criterio de aceptación.

Construye en este orden:
TOKENS → ATOMS → MOLECULES → ORGANISMS → LAYOUT → STATES → VALIDATION

Usa una estética técnica y humana: OLED oscuro, contraste legible, tipografía sans limpia, mono sólo para datos, bordes sutiles, una paleta de acento con significado y espacio negativo controlado. La sofisticación debe venir de la composición, no de acumular efectos.
```

## Premium CSS principles / Principios CSS premium

| Principle / Principio | Default / Por defecto | Constraint / Límite |
| --- | --- | --- |
| Fluid scale / Escala fluida | Use `clamp()` for type, spacing and radii where viewport scaling is useful. / Usa `clamp()` para tipografía, espaciado y radios. | Preserve usable minimums and readable line length. / Conserva mínimos usables y longitud legible. |
| Context adaptation / Adaptación contextual | Use `@container` for reusable components. / Usa `@container` en componentes reutilizables. | Keep a viewport media-query fallback. / Mantén fallback por viewport. |
| Parent reactivity / Reactividad de padres | Use `:has()` and `:is()` for local visual state. / Usa `:has()` y `:is()` para estados visuales locales. | Do not hide semantic state or replace required JS behavior. / No ocultes estados semánticos ni reemplaces lógica necesaria. |
| Scroll motion / Motion de scroll | Use scroll-driven CSS timelines as progressive enhancement. / Usa timelines CSS como mejora progresiva. | Provide static and reduced-motion fallbacks. / Proporciona fallback estático y reduced motion. |
| Color / Color | Prefer `oklch()` for controlled gradients and contrast tuning. / Prefiere `oklch()` para degradados y contraste. | Verify contrast and provide sRGB fallback if needed. / Verifica contraste y fallback sRGB. |
| Glass / Glassmorphism | Use restrained blur, saturation and translucent borders. / Usa blur, saturación y bordes translúcidos con moderación. | Never use blur as the only separation or at the cost of text legibility. / Nunca dependas sólo del blur. |
| Cursor light / Luz de cursor | Use CSS variables for pointer position and a soft radial highlight. / Usa variables CSS para la posición del cursor. | Disable or simplify on touch and reduced motion. / Desactiva o simplifica en touch y reduced motion. |

## Spatial composition / Composición espacial

Use asymmetric bento layouts only when they improve scanning. Define one dominant surface, one supporting surface and one action surface. Every card must answer what it contains, why it matters and what happens when selected. Use `border: 1px solid rgba(255,255,255,.08)` as a starting token, not a rule for every element.

Usa bento asimétrico sólo cuando mejore la lectura. Define una superficie dominante, una de apoyo y una de acción. Cada tarjeta debe explicar qué contiene, por qué importa y qué ocurre al seleccionarla. Usa `border: 1px solid rgba(255,255,255,.08)` como token inicial, no como obligación para cada elemento.

## Typography / Tipografía

Pair a clean sans with a technical mono only when the mono communicates data, code, metadata or system state. Build hierarchy with weight, contrast, measure and tracking before increasing size. Headings may use restrained negative tracking; body copy must preserve readability.

Combina sans limpia con mono sólo cuando la mono comunique datos, código, metadatos o estado del sistema. Construye la jerarquía con peso, contraste, medida y tracking antes de aumentar el tamaño. Los títulos pueden usar tracking negativo con moderación; el texto debe seguir siendo legible.

## Interaction and accessibility / Interacción y accesibilidad

Use CSS for hover, focus visuals, local reveal and decorative transitions. Use JavaScript or framework state for playback, audio, drag, keyboard commands, persistence, async state, analytics, permissions and anything that changes application data. Never replace a real button with a styled `div`. Preserve visible focus, keyboard operation, `prefers-reduced-motion`, touch behavior and a text fallback.

For primary actions use a 40–44px target; secondary controls use 32–36px only when the context remains accessible; form fields default to 40px. These are touch and rhythm tokens, not permission to make every component fixed-size.

## Prompt for implementation / Prompt de implementación

```text
Entrega una implementación completa y verificable.

DESIGN_TOKENS:
- surface: #050505;
- foreground: #f5f5f0;
- muted: #8b8b87;
- border: rgba(255,255,255,.08);
- accent: define meaning before color;
- type_scale: clamp-based with readable maximum;
- spacing: fluid where useful, explicit for interaction targets.

REQUIRED_STATES:
idle, hover, focus-visible, active, loading, disabled, success, error, empty, reduced-motion.

MODERN_CSS:
Use container queries, :is(), :has(), oklch() and scroll-driven animation only with feature detection or graceful fallback. Avoid unnecessary React state and libraries, but do not replace functional behavior with CSS.

VALIDATION:
Check keyboard, contrast, touch, responsive containers, reduced motion, layout shift, frame budget, console errors and the primary user task. Report what was tested and what remains unverified.
```

## Anti-patterns / Antipatrones

Do not apply glass, glow, bento, parallax, cursor light or scroll animation by default. Do not use arbitrary CSS merely to look complex, hide navigation, reduce contrast, remove focus rings, trap scroll, autoplay audio, or make a decorative layer block the real control. A premium interface is calm, direct and recoverable.
