---
name: design-ui-library
description: Biblioteca bilingüe de Design & UI Skills para resolver problemas de interfaces de producto mediante tokens, átomos, moléculas, organismos y layouts. Úsala cuando necesites elegir un patrón, explicar qué problema resuelve, generar una especificación UI, definir estados, accesibilidad, motion, responsive, 3D/canvas, Remotion o consultar el catálogo mediante MCP.
license: MIT
compatibility: Compatible con agentes que soporten Agent Skills. La consulta MCP es opcional; sin MCP, usa `library/design-catalog.json` y las tablas de esta skill.
metadata:
  library: universal-design-ui
  language: bilingual-en-es
  hierarchy: tokens-atoms-molecules-organisms
  mcp_tools: get_design_tokens, render_component, search_ui_catalog
---

# Design & UI Skill Library / Biblioteca de Design & UI

## What this library solves / Qué problema resuelve

**EN:** This library prevents vague UI generation. Every skill identifies the user problem, intended outcome, trigger, inputs, outputs, visual states, responsive behavior, accessibility rules, and acceptance criteria before code or mockups are produced.

**ES:** Esta biblioteca evita la generación de UI vaga. Cada skill identifica el problema del usuario, el resultado esperado, el trigger, las entradas, las salidas, los estados visuales, el comportamiento responsive, las reglas de accesibilidad y los criterios de aceptación antes de producir código o mockups.

## How to work / Cómo trabajar

1. **Classify / Clasifica.** Choose the atomic level: Tokens, Atoms, Molecules, Organisms, or Layouts. Then identify the problem category: navigation, forms, states, data density, motion, 3D/canvas, Remotion, accessibility, or AI workspace.
2. **Select / Selecciona.** Search the catalog by intent and tags. Choose the smallest component that solves the problem. Do not activate the whole library at once.
3. **Specify / Especifica.** Complete: problem, purpose, when to use, avoid when, inputs, outputs, states, tokens, interaction, accessibility, responsive rules, performance budget, and example copy in both languages.
4. **Compose / Compón.** Build `Tokens → Atoms → Molecules → Organisms → Layout`. Keep the dependency direction one-way; an atom must not know about an organism.
5. **Validate / Valida.** Check keyboard operation, visible focus, contrast, reduced motion, mobile layout, loading/error/success states, localization length, and whether the component still solves the stated problem.

## Atomic model / Modelo atómico

| Level / Nivel | Problem solved / Problema que resuelve | Output / Salida |
| --- | --- | --- |
| **Tokens** | Consistency, theme, motion, spacing / Consistencia, tema, motion y espaciado | CSS variables, Tailwind tokens, JSON contract |
| **Atoms / Átomos** | One interaction or semantic primitive / Una interacción o primitiva semántica | Button, input, badge, icon, spinner |
| **Molecules / Moléculas** | A focused task composed from atoms / Una tarea enfocada compuesta de átomos | Command palette, filter toolbar, action bar |
| **Organisms / Organismos** | A complete product region / Una región completa del producto | App shell, detail inspector, dashboard grid |
| **Layouts** | Spatial behavior across contexts / Comportamiento espacial entre contextos | Navigation, responsive grid, canvas stage |

## Global design tokens / Tokens globales

Use the `oled` theme for cinematic dark product surfaces and `highContrast` for accessibility-critical or low-vision contexts. The default spacing unit is 4px. Primary controls are 40–44px high; secondary controls are 32–36px; enterprise inputs are 40px. Avoid excessive pill shapes; use 4–16px radii intentionally.

Use these motion curves: `standard: cubic-bezier(0.2, 0.8, 0.2, 1)`, `entrance: cubic-bezier(0.16, 1, 0.3, 1)`, `exit: cubic-bezier(0.7, 0, 0.84, 0)`, and `spring: cubic-bezier(0.34, 1.56, 0.64, 1)`. Respect `prefers-reduced-motion`; replace movement with opacity, color, or an instant state change.

## Button state contract / Contrato de estados del botón

Every interactive button must define: `idle`, `hover`, `focus`, `active`, `loading`, `disabled`, `success`, and `error`. Loading preserves the label, shows an inline spinner, sets `aria-busy=true`, prevents duplicate submission, and provides a completion announcement. Success and error must include text or an accessible live-region message; color alone is not sufficient.

```json
{
  "name": "Button",
  "props": {
    "variant": "primary | secondary | danger | ghost",
    "size": "sm | md | lg",
    "label": "Save changes / Guardar cambios",
    "isLoading": false,
    "status": "idle | success | error",
    "disabled": false
  }
}
```

## Universal layouts / Layouts universales

**Navigation bar / Barra de navegación:** use a 260px desktop rail, a compact mobile drawer, clear active state, keyboard order, and an explicit collapse affordance. Keep the main workspace fluid and allow an optional right context panel.

**Command palette / Paleta Cmd+K:** open with `Cmd/Ctrl+K`, close with Escape, keep focus inside the dialog, filter commands by label and synonym, display shortcuts, and expose `role=dialog` plus `role=listbox` semantics.

**Floating action bar / Barra flotante:** anchor it to the selection, keep it out of the reading flow, announce changes, and collapse into an overflow menu when the viewport is narrow.

**Responsive grid / Grid responsive:** use content-aware `minmax()` tracks; define empty, loading, error, dense, and high-contrast variants. Never rely on a fixed card height when labels are bilingual.

## 3D, Canvas and Remotion / 3D, Canvas y Remotion

**EN:** Treat 3D as a product capability, not decoration. Define the scene purpose, interaction affordances, fallback image, reduced-motion mode, and performance budget. For Remotion, specify FPS, duration, scenes, frame ranges, easing, and render fallback. Use React Three Fiber or a compatible canvas renderer only behind a bounded organism.

**ES:** Trata el 3D como una capacidad del producto, no como decoración. Define el propósito de la escena, las affordances, la imagen fallback, el modo reduced-motion y el presupuesto de rendimiento. Para Remotion, especifica FPS, duración, escenas, rangos de frames, easing y fallback de render. Usa React Three Fiber o un renderer canvas compatible sólo dentro de un organismo acotado.

## Human-readable skill template / Plantilla legible para humanos

```md
### Component: [English name] / [Nombre en español]

- Problem / Problema: [What breaks today / Qué falla hoy]
- Purpose / Propósito: [Outcome / Resultado]
- Use when / Usar cuando: [Trigger / Trigger]
- Avoid when / Evitar cuando: [Counterexample / Contraejemplo]
- Inputs / Entradas: [Props, data, context / Props, datos, contexto]
- Outputs / Salidas: [Rendered UI, events / UI, eventos]
- States / Estados: [Idle, hover, focus, loading, error, success]
- Tokens: [Colors, spacing, radius, motion]
- Accessibility / Accesibilidad: [Keyboard, focus, labels, contrast]
- Responsive / Responsive: [Breakpoints and adaptation / Adaptación]
- Acceptance / Aceptación: [Pass/fail checks / Checks]
```

## MCP optional context / Contexto MCP opcional

If MCP is available, use only the declared schemas in `library/design-catalog.json`. `get_design_tokens()` returns the design token contract. `search_ui_catalog(query, level?, tags?, limit?)` finds components by problem, purpose, tag, level, or bilingual text. `render_component(component_id, props, language?)` returns a safe render specification; it must not execute arbitrary code or mutate a project without explicit user authorization.

Si MCP está disponible, usa sólo los schemas declarados en `library/design-catalog.json`. `get_design_tokens()` devuelve el contrato de tokens. `search_ui_catalog(query, level?, tags?, limit?)` encuentra componentes por problema, propósito, etiqueta, nivel o texto bilingüe. `render_component(component_id, props, language?)` devuelve una especificación segura; no debe ejecutar código arbitrario ni modificar un proyecto sin autorización explícita.

## Definition of done / Definición de terminado

A Design & UI Skill is ready when a human can answer “what problem does this solve?”, a model can identify the trigger and required inputs, the result has both English and Spanish copy, all interactive states are specified, the layout adapts to mobile, keyboard and reduced-motion paths work, and the acceptance criteria are testable.
