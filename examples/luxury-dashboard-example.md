# Practical example / Ejemplo práctico

## Product / Producto

**Signal Room** is a B2B AI operations dashboard for a CTO who needs to understand system health, approve risky actions and move from signal to decision without noise.

**Signal Room** es un dashboard B2B de operaciones de IA para un CTO que necesita entender la salud del sistema, aprobar acciones de riesgo y pasar de señal a decisión sin ruido.

## Problem / Problema

The existing dashboard shows too many charts, hides the most important action and makes a user inspect several pages before understanding whether an incident needs attention.

El dashboard actual muestra demasiados gráficos, oculta la acción principal y obliga a revisar varias páginas antes de saber si un incidente necesita atención.

## Design decision / Decisión de diseño

Use the own territory **quiet cinematic technology**: OLED surfaces, one cobalt semantic accent, editorial typography, generous space and a single dominant gesture: the current operational signal. No decorative 3D is used because it would not improve incident comprehension.

Usa el territorio propio **tecnología cinematográfica silenciosa**: superficies OLED, un acento cobalto semántico, tipografía editorial, aire generoso y un solo gesto dominante: la señal operativa actual. No se usa 3D decorativo porque no mejora la comprensión del incidente.

## Tokens / Tokens

```css
:root {
  --surface-0: #000000;
  --surface-1: #09090b;
  --surface-2: #111113;
  --surface-3: #18181b;
  --border: #27272a;
  --text-strong: #fafafa;
  --text-muted: #a1a1aa;
  --accent: #4f6bff;
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #fb7185;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --radius-control: 8px;
  --duration-micro: 150ms;
  --duration-component: 300ms;
  --ease-entry: cubic-bezier(.16, 1, .3, 1);
  --ease-state: cubic-bezier(.4, 0, .2, 1);
}
```

## Layout / Layout

Use a 260px navigation rail only because the product has many operational sections. The main canvas uses a 12-column grid and a readable max width. The right inspector is 320px and collapses below the canvas on narrow screens.

Usa un rail de navegación de 260px porque el producto tiene muchas secciones operativas. El canvas central usa una cuadrícula de 12 columnas y un ancho máximo legible. El inspector derecho mide 320px y pasa debajo del canvas en pantallas estrechas.

```text
┌──────────────┬──────────────────────────────────┬───────────────┐
│ 260px rail   │ Main canvas                      │ 320px context │
│ navigation   │ Signal hero · metrics · queue    │ incident data  │
└──────────────┴──────────────────────────────────┴───────────────┘
```

## Atomic construction / Construcción atómica

**Tokens** define the OLED surfaces, semantic colors, 8px rhythm, typography and motion. **Atoms** are the status dot, label, icon button, metric value, badge and primary action. **Molecules** are the signal card, filter field, incident row and approval control. **Organisms** are the signal hero, incident queue, metrics strip and contextual inspector. **Layout** is the three-column operations shell.

**Tokens** definen superficies OLED, colores semánticos, ritmo de 8px, tipografía y motion. **Átomos** son el punto de estado, label, icon button, métrica, badge y acción primaria. **Moléculas** son la signal card, el filtro, la fila de incidente y el control de aprobación. **Organismos** son el signal hero, la cola de incidentes, la franja de métricas y el inspector contextual. **Layout** es el shell operativo de tres columnas.

## Main view / Vista principal

The first viewport contains the product name, one sentence explaining the current state, a single primary action **Review incident**, three evidence metrics and the incident queue. The design does not show a marketing hero because this is an operate-mode surface.

El primer viewport contiene el nombre del producto, una frase que explica el estado actual, una única acción primaria **Revisar incidente**, tres métricas de evidencia y la cola de incidentes. No muestra un hero de marketing porque es una superficie de operación.

```tsx
<main className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
  <section aria-labelledby="signal-title" className="grid grid-cols-12 gap-6 p-8">
    <div className="col-span-8 rounded-lg border border-[#27272A] bg-[#111113] p-8">
      <p className="text-sm text-[#A1A1AA]">System signal · Señal del sistema</p>
      <h1 id="signal-title" className="mt-2 text-4xl font-semibold tracking-[-0.02em]">
        Stable, with one review needed
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-6 text-[#D4D4D8]">
        One deployment changed the error budget. Review the evidence before approving rollback.
      </p>
      <button className="mt-8 h-11 rounded-lg bg-[#4F6BFF] px-4 font-medium text-white outline-offset-2 transition-[transform,background] duration-150 ease-out hover:bg-[#667FFF] focus-visible:outline-2 focus-visible:outline-[#A5B4FC] active:scale-[.98]">
        Review incident
      </button>
    </div>
    <aside aria-label="Context" className="col-span-4 rounded-lg border border-[#27272A] bg-[#111113] p-6">
      <p className="text-sm text-[#A1A1AA]">Context · Contexto</p>
      <p className="mt-3 text-sm leading-6 text-[#D4D4D8]">Production / Payments API</p>
      <p className="mt-1 text-sm text-[#A1A1AA]">Updated 42 seconds ago</p>
    </aside>
  </section>
</main>
```

## Button state contract / Contrato de estados

| State / Estado | Behavior / Comportamiento |
| --- | --- |
| Idle / Reposo | Solid cobalt action with clear label. / Acción cobalto con label claro. |
| Hover | Small luminance increase, no layout shift. / Aumenta luminancia sin mover layout. |
| Focus-visible | 2px visible outline with offset. / Outline visible de 2px con offset. |
| Active | 2% scale reduction for 150ms. / Reducción de escala del 2% durante 150ms. |
| Loading | Keep label context and add inline spinner; prevent duplicate submission. / Mantén contexto y añade spinner inline. |
| Disabled | Lower contrast plus explanation, never color alone. / Menor contraste más explicación, nunca sólo color. |
| Success | Replace spinner with check and announce status. / Sustituye spinner por check y anuncia estado. |
| Error | Preserve user input, explain recovery and expose retry. / Conserva entrada, explica recuperación y muestra retry. |

## Motion / Motion

The signal card enters with a 300ms ease-out. Metric changes use a 150ms number transition only when the value changes. No parallax or WebGL is used. With `prefers-reduced-motion`, the same states appear instantly and remain fully understandable.

## Accessibility and performance / Accesibilidad y rendimiento

Every action is reachable with the keyboard, every status has text, the contrast is tested, and the incident queue exposes an `aria-live="polite"` update for new evidence. The initial screen loads without a 3D dependency, image assets are lazy where noncritical, and the target performance budget is a fast first contentful view with no blocking animation.

## Acceptance / Aceptación

The design passes only when a CTO can identify the current state in five seconds, reach the primary review action with keyboard only, understand loading and error recovery, use the layout on a narrow screen and explain why every visual effect exists. If the effect does not improve comprehension, it is removed.

## Skill output / Salida de la skill

```yaml
objective: "Reducir el tiempo para entender y revisar incidentes de producción"
problem: "El dashboard actual dispersa la evidencia y oculta la acción principal"
selected_capabilities: ["design-frontend", "architecture", "qa-security"]
visual_territory: "quiet cinematic technology"
artifacts: ["tokens", "atomic component map", "responsive shell", "state contract"]
checks: ["keyboard path", "contrast", "reduced motion", "responsive", "performance budget"]
stop_condition: "Acceptance criteria pass; no extra visual effects or features"
```
