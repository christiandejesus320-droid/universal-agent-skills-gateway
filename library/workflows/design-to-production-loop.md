# Design-to-Production Loop / Bucle de Diseño a Producción

## Purpose / Propósito

**EN:** Turn an ambiguous interface request into a validated, production-ready UI change without skipping the user problem, component states, accessibility, responsive behavior, or human authorization.

**ES:** Convertir una petición de interfaz ambigua en un cambio UI listo para producción sin saltarse el problema del usuario, los estados, la accesibilidad, el comportamiento responsive ni la autorización humana.

## When to use / Cuándo usarlo

Use this workflow for new screens, dashboard regions, design-system components, AI workspaces, command palettes, forms, navigation, motion, 3D/canvas scenes, Remotion storyboards, and substantial visual refactors.

Usa este flujo para nuevas pantallas, regiones de dashboard, componentes de sistema de diseño, workspaces de IA, paletas de comandos, formularios, navegación, motion, escenas 3D/canvas, storyboards de Remotion y refactors visuales importantes.

## Workflow contract / Contrato del flujo

| Phase / Fase | Human question / Pregunta humana | Model action / Acción del modelo | Exit checkpoint / Checkpoint de salida |
|---|---|---|---|
| **1. Discover / Descubrir** | What outcome matters? / ¿Qué resultado importa? | Restate user, business and technical context. | Objective, audience, constraints and success metric are explicit. |
| **2. Diagnose / Diagnosticar** | What is broken today? / ¿Qué falla hoy? | Identify friction, risk, accessibility and content problems. | One primary problem and measurable acceptance criteria. |
| **3. Select / Seleccionar** | Which smallest skill solves it? / ¿Cuál es la skill mínima? | Search catalog by intent, level and tags. | Selected skills, reason and excluded alternatives. |
| **4. Compose / Componer** | What must be combined? / ¿Qué debe combinarse? | Compose Tokens → Atoms → Molecules → Organisms → Layout. | Dependency map and no reverse atomic dependencies. |
| **5. Blueprint / Definir blueprint** | What will users see and do? / ¿Qué verán y harán? | Specify hierarchy, copy, states, responsive rules, motion, 3D fallback and MCP context. | Bilingual design brief with component contract. |
| **6. Preview / Previsualizar** | Can we see the important states? / ¿Se ven los estados? | Render static preview or interactive prototype. | Idle, hover, focus, active, loading, success, error and empty states visible. |
| **7. Validate / Validar** | Is it usable by everyone? / ¿Es usable para todos? | Check keyboard, focus, contrast, reduced motion, localization and viewport changes. | Accessibility and responsive checklist passes. |
| **8. Implement / Implementar** | Is it production code? / ¿Es código de producción? | Build typed components, tests and error handling without arbitrary execution. | Source, tests and docs updated. |
| **9. Review / Revisar** | Did implementation preserve intent? / ¿Preservó la intención? | Compare implementation against blueprint and acceptance criteria. | Findings classified by severity with evidence. |
| **10. Ship / Publicar** | Is release authorized? / ¿Está autorizada la publicación? | Run CI and prepare release/PR; never publish or mutate production silently. | Human confirms merge, deploy or external side effect. |
| **11. Reflect / Aprender** | What should become reusable? / ¿Qué debe reutilizarse? | Extract reusable tokens, examples, edge cases and lessons. | Catalog update or explicit reason not to extract. |

## Required input / Entrada obligatoria

`objective`, `surface`, `audience`, `current_problem`, `constraints`, `content_language`, `atomic_level`, `risk_level`, `available_assets`, `target_platform`, and `authorization_scope`.

## Required output / Salida obligatoria

Return this structure in Markdown or JSON:

```json
{
  "objective": "...",
  "problem": "...",
  "selected_skills": [],
  "composition": {"tokens": [], "atoms": [], "molecules": [], "organisms": [], "layouts": []},
  "blueprint": {"hierarchy": [], "states": [], "responsive": [], "motion": [], "accessibility": []},
  "implementation": {"files": [], "tests": [], "mcp_context": []},
  "evidence": [],
  "risks": [],
  "human_checkpoints": [],
  "next_step": "..."
}
```

## Stop conditions / Condiciones de parada

Stop and ask for human input when requirements conflict, content is legally sensitive, a destructive action is requested, an external post/deploy/payment is implied, credentials are needed, the selected skill is untrusted, or the acceptance criteria cannot be tested.

Detente y pide intervención humana cuando haya conflictos de requisitos, contenido legalmente sensible, una acción destructiva, publicación/despliegue/pago externo, credenciales, una skill no confiable o criterios que no puedan probarse.

## Quality gate / Puerta de calidad

A workflow run is complete only if the selected skill explains the problem it solves, the UI has all relevant states, the bilingual copy is readable, keyboard and reduced-motion paths work, responsive behavior is explicit, tests or evidence exist, and the final side effect is authorized by a human.
