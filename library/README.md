# Universal Design & UI Skill Library / Biblioteca Universal de Design & UI Skills

## What this is / Qué es

**English:** A catalog-based library of readable design skills. It teaches a human or model what problem a pattern solves, when to use it, what inputs it needs, what it returns, which states it has, and how to validate it.

**Español:** Una biblioteca de skills de diseño legibles y organizadas por catálogo. Enseña a una persona o a un modelo qué problema resuelve un patrón, cuándo usarlo, qué entradas necesita, qué devuelve, qué estados tiene y cómo validarlo.

## Catalog flow / Flujo del catálogo

| Layer / Nivel | Use it for / Úsalo para | Example / Ejemplo |
|---|---|---|
| Tokens | Theme, color, spacing, motion / Tema, color, espaciado, motion | OLED, high contrast, 4px scale |
| Atoms / Átomos | Single primitive / Primitiva individual | Button, input, badge |
| Molecules / Moléculas | Focused task / Tarea enfocada | Command palette, filters |
| Organisms / Organismos | Product region / Región de producto | App shell, inspector |
| Layouts | Spatial behavior / Comportamiento espacial | Dashboard, responsive grid, canvas |

## Human workflow / Flujo humano

Start by asking: **What problem is visible? / ¿Qué problema se ve?** Then search by intent, select the smallest applicable pattern, read the bilingual purpose and counterexample, and only afterwards compose it into a larger organism. Use the Playground to review state transitions before implementation.

## Model workflow / Flujo para modelos

Load `skills/design-ui-library/SKILL.md`. Read `library/design-catalog.json` only after identifying the task category. Return a structured brief with `problem`, `purpose`, `when_to_use`, `inputs`, `outputs`, `states`, `tokens`, `accessibility`, `responsive`, `performance`, and `acceptance`. Never output a component without explaining which user problem it resolves.

## Optional MCP / MCP opcional

The file `mcp-tools.schema.json` defines the read-only operations. A compatible MCP adapter may expose them as `get_design_tokens`, `render_component`, and `search_ui_catalog`. The library remains complete without a running server: the JSON catalog and Markdown skills are the source of truth.

El archivo `mcp-tools.schema.json` define operaciones de solo lectura. Un adaptador MCP compatible puede exponerlas como `get_design_tokens`, `render_component` y `search_ui_catalog`. La biblioteca sigue completa sin un servidor activo: el JSON del catálogo y las skills Markdown son la fuente de verdad.

## Visual references / Referencias visuales

The `assets/` directory contains practical workspace references supplied for this library: a component/MCP bridge workbench and a design-review workspace. They demonstrate the intended context for the catalog: real people, real screens, real decisions, not abstract component dumps.

El directorio `assets/` contiene referencias prácticas del espacio de trabajo aportadas para esta biblioteca: un banco de trabajo de puente MCP/componentes y un espacio de revisión de diseño. Muestran el contexto previsto: personas, pantallas y decisiones reales, no simples listas abstractas de componentes.

## References / Referencias

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [MCP Specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)
- [Remotion Three](https://www.remotion.dev/docs/three)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Agent Skills Specification](https://agentskills.io/specification)
