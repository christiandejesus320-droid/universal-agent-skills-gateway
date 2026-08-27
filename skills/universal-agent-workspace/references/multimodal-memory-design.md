# Multimodal Memory Design / Diseño de Memoria Multimodal

Use this reference when a task involves text, images, audio, video, screen state, documents, retrieval or long-running agent continuity. Do not load it for a text-only task unless memory behavior is part of the request.

## Context policy / Política de contexto

```text
Antes de cargar una modalidad, responde:
- ¿Qué decisión desbloquea este dato?
- ¿Puedo resolverlo con el repositorio o el texto existente?
- ¿Cuál es la representación mínima útil?
- ¿Qué dato debe conservarse después de esta fase?

Carga primero texto estructurado. Añade imagen, audio o video sólo si la modalidad contiene evidencia que no existe en el texto. Resume cada modalidad antes de pasar a la siguiente.
```

## Memory layers / Capas de memoria

| Layer / Capa | Keep / Conservar | Discard / Descargar |
| --- | --- | --- |
| Working | Current objective, constraints, active files, decisions and blockers. / Objetivo, restricciones, archivos activos, decisiones y bloqueos. | Exploratory prose and duplicate context. / Prosa exploratoria y contexto duplicado. |
| Episodic | What was tried, result, error, test and next action. / Qué se probó, resultado, error, test y siguiente acción. | Raw logs after extracting evidence. / Logs crudos después de extraer evidencia. |
| Semantic | Stable facts, schemas, design tokens, policies and reusable patterns. / Hechos estables, esquemas, tokens, políticas y patrones. | Unverified assumptions. / Supuestos no verificados. |
| Approval | Human decisions, authorizations, rejected actions and expiry. / Decisiones humanas, autorizaciones, rechazos y caducidad. | Implied consent. / Consentimiento implícito. |

## Multimodal handoff prompt / Prompt de transferencia multimodal

```text
Resume el material recibido en una ficha compacta antes de actuar:
source_type: text | image | audio | video | screen | data
source_id: "..."
observations: [hechos observables, sin interpretación innecesaria]
relevant_to_objective: [sólo lo que desbloquea la tarea]
uncertainty: [lo que no puede afirmarse]
actionable_constraints: [límites, formato, accesibilidad, rendimiento]
retained_memory: [máximo cinco hechos para la siguiente fase]
discarded_context: [lo que no debe viajar]
```

## Long-running continuity

At every phase boundary, persist only objective, current state, completed checks, unresolved risks, authorized side effects and next step. If memory conflicts with the current files or user instructions, prefer current verified state and flag the conflict. Never infer permission from remembered intent.

## Accessibility and privacy

Provide captions or transcripts for audio and video, alt text for visual evidence and a text fallback for spatial interfaces. Redact personal data, secrets, tokens, faces or private screens before storing summaries. Do not use multimodal memory as a reason to retain more data than the task requires.
