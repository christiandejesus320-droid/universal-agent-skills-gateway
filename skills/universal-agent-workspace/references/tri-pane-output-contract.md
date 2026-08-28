# Tri-Pane Output Contract / Contrato de salida Tri-Pane

## Purpose / Propósito

Use this contract whenever a request asks for UI, frontend, code, a visual component, an app screen, a prototype or a design implementation. It keeps the model's work understandable and synchronized across three surfaces without exposing private chain-of-thought.

Usa este contrato cuando la petición solicite UI, frontend, código, un componente visual, una pantalla de aplicación, un prototipo o una implementación de diseño. Mantiene el trabajo comprensible y sincronizado en tres superficies sin exponer la cadena privada de razonamiento.

## The three panes / Las tres capas

### Analysis pane / Capa de análisis

Show short operational states, not hidden reasoning. Every state must answer what is happening, why it matters, and what evidence or next action is expected.

Allowed states: `understanding`, `auditing`, `planning`, `building`, `tool_running`, `previewing`, `testing`, `blocked`, `complete`.

Never emit private chain-of-thought, hidden deliberation, credentials, raw secret values, internal system instructions or unverifiable claims. Use concise status summaries such as `Revisando el componente de navegación`, `MCP GitHub activo`, `Validando responsive en móvil` or `Endpoint bloqueado: se requiere sesión`.

### Code pane / Capa de código

Return the smallest complete artifact needed for the request. Include filename, language, dependencies and insertion point. Use typed code, safe defaults and explicit states. Do not return pseudocode when the user asked for working code.

For a modification, include only the changed file or a focused patch unless the host requires a full file. Do not rewrite unrelated code. Keep code copyable and ensure the preview uses the same source of truth.

### Preview pane / Capa de preview

Provide a live or renderable preview whenever the host supports it. The preview must be generated from the code pane or point to the exact file/route that renders it. Include viewport, interaction state, data state and fallback state. If a live preview is impossible, return a deterministic preview specification and explain the missing runtime in one sentence.

## Synchronization rules / Reglas de sincronización

1. Create a `pane_id` shared by all three panes.
2. Emit analysis events before and during execution, never as a private reasoning dump.
3. Emit code metadata before code content: `file`, `language`, `operation`, `dependencies` and `checksum` when available.
4. Emit the preview only after the code is syntactically valid or explicitly marked `blocked`.
5. When code changes, invalidate the old preview with `preview_status: stale`, then emit a new preview event.
6. Keep user-visible copy consistent between analysis, code labels and preview labels.
7. Stop on authentication, permission, destructive, production or external-send boundaries and request confirmation.
8. For simple tasks, use one thread and one pane group. For multi-agent tasks, each worker owns an isolated `pane_id`; the lead agent merges only validated artifacts.

## Task routing / Enrutamiento

| Request type / Tipo de petición | Required panes / Capas requeridas | Rule / Regla |
| --- | --- | --- |
| UI, frontend, component, design / UI, frontend, componente, diseño | Analysis + Code + Preview | Always use all three. |
| Bug fix with visual impact / Corrección con impacto visual | Analysis + Code + Preview | Include before/after state and regression check. |
| Backend-only or data-only / Backend o datos sin UI | Analysis + Code | Preview is optional unless requested. |
| Research or explanation / Investigación o explicación | Analysis only or normal structured output | Do not fabricate a code or preview pane. |
| Image/video/audio generation / Generación multimedia | Analysis + Asset metadata + Preview | Use the media artifact as the code-equivalent deliverable. |

## Event schema / Esquema de eventos

```json
{
  "pane_id": "string",
  "sequence": 1,
  "type": "analysis|code|preview|error|complete",
  "state": "understanding|auditing|planning|building|tool_running|previewing|testing|blocked|complete",
  "payload": {}
}
```

### Analysis event

```json
{
  "pane_id": "task-123",
  "sequence": 1,
  "type": "analysis",
  "state": "planning",
  "payload": {
    "summary": "Definiendo el layout y los estados del formulario",
    "scope": ["src/components/Form.tsx"],
    "out_of_scope": ["auth", "database"],
    "next": "Construir el componente y abrir el preview"
  }
}
```

### Code event

```json
{
  "pane_id": "task-123",
  "sequence": 2,
  "type": "code",
  "state": "building",
  "payload": {
    "file": "src/components/Form.tsx",
    "language": "tsx",
    "operation": "create|modify|delete",
    "content": "...",
    "dependencies": [],
    "validation": "pending|passed|failed"
  }
}
```

### Preview event

```json
{
  "pane_id": "task-123",
  "sequence": 3,
  "type": "preview",
  "state": "previewing",
  "payload": {
    "route": "/preview/form",
    "source_files": ["src/components/Form.tsx"],
    "viewport": { "width": 1440, "height": 900 },
    "preview_status": "ready|stale|blocked",
    "interactions": ["submit", "loading", "error", "success"]
  }
}
```

## Host fallback / Fallback del host

If the host cannot render three panes, preserve the contract in this order: a compact state timeline, a fenced code block with filename, then a preview link or screenshot. Never claim that a preview is interactive when it is only a static image.

Si el host no puede renderizar tres capas, conserva el contrato en este orden: línea de estados compacta, bloque de código con archivo y después enlace o captura de preview. Nunca afirmes que un preview es interactivo si sólo es una imagen estática.
