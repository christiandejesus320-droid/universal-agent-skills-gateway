# Efficiency engines / Motores de eficiencia

Read this reference when a task is long, multi-agent, error-prone or involves repeated edits. Do not load it for a simple request.

## Intent translation / Traducción de intención

Convert the user's words into a compact operational brief before acting: `objective`, `scope`, `allowed_context`, `allowed_actions`, `out_of_scope` and `acceptance`. Ask only about ambiguities that could change the result. Do not infer adjacent requirements.

Convierte las palabras del usuario en un brief operativo compacto antes de actuar: `objective`, `scope`, `allowed_context`, `allowed_actions`, `out_of_scope` y `acceptance`. Pregunta sólo por ambigüedades que puedan cambiar el resultado. No infieras requisitos adyacentes.

## Patch-only updates / Actualizaciones sólo por patch

When changing existing code or text, do not rewrite the whole file to change a small region. Use the host's search/replace or patch mechanism with the smallest stable context. Return only changed blocks or an exact diff when the user asks for code output. Preserve everything outside the requested change.

Al modificar código o texto existente, no reescribas el archivo completo para cambiar una región pequeña. Usa search/replace o patch con el contexto estable mínimo. Devuelve sólo bloques modificados o un diff exacto cuando se solicite código. Conserva todo lo que está fuera del cambio pedido.

## State flush / Poda de estado

After validating a phase or worker, retain only the net artifact, decision, evidence and unresolved blocker. Stop carrying failed attempts, verbose logs, duplicate explanations or internal reasoning into the next phase. For a worker handoff, send only the validated result and the next required input.

Después de validar una fase o worker, conserva sólo el artefacto neto, decisión, evidencia y bloqueo pendiente. No arrastres intentos fallidos, logs extensos, explicaciones duplicadas ni razonamiento interno a la siguiente fase. En un handoff, envía sólo el resultado validado y la siguiente entrada necesaria.

## Hard definition of done / Definición estricta de terminado

Stop as soon as the agreed objective, acceptance criteria and relevant checks pass. Do not add nice-to-have features, unsolicited refactors, extra tests, tutorials, future suggestions or decorative closing prose. If a new idea is outside scope, record it in one line only when necessary and do not implement it.

Detente cuando el objetivo acordado, los criterios de aceptación y los checks relevantes pasen. No añadas features opcionales, refactors no solicitados, tests extra, tutoriales, sugerencias futuras ni prosa decorativa. Si una idea está fuera de alcance, regístrala en una sola línea sólo cuando sea necesario y no la implementes.

## Minimal state transfer / Transferencia mínima

Use this compact handoff:

```json
{"status":"done|blocked","artifact":"path or value","evidence":["check"],"blocker":null,"next_input":"..."}
```

This policy reduces waste but does not override safety, authorization, host permissions or the user's explicit request for detail.

Esta política reduce desperdicio, pero no sustituye seguridad, autorización, permisos del host ni una solicitud explícita de detalle.
