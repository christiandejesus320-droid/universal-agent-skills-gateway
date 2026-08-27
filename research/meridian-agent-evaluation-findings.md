
## Project Astra

Fuente: https://deepmind.google/models/project-astra/

La página oficial presenta Project Astra como una línea de investigación para un asistente universal y destaca la memoria multimodal: integrar distintos tipos de datos para realizar tareas y recordar detalles relevantes de interacciones anteriores. La skill puede traducir esto a una política de contexto: permitir texto, imagen, audio o video sólo cuando la tarea lo justifique, extraer un resumen compacto y conservar únicamente decisiones, restricciones y hechos verificables. No debe afirmar que posee las capacidades de Astra ni copiar implementaciones propietarias.

## Mastra

Fuente: https://mastra.ai/

Mastra se presenta como framework TypeScript open source para agentes y aplicaciones, con agentes, workflows, memoria, workspaces, observabilidad, MCP y evaluación. Su documentación pública destaca workflows con control explícito, branching, paralelismo, human-in-the-loop, persistencia de estado, memoria conversacional y semántica, scorers model-graded y rule-based, trazas de llamadas y tokens, guardrails y sanitización frente a prompt injection.

La skill puede reutilizar estos patrones como contratos model-neutral: estados explícitos, pausa ante aprobación humana, memoria por capas, observabilidad de consumo, evaluaciones deterministas y heurísticas, y guardrails de entrada/salida. No se integrará Mastra como dependencia obligatoria porque la skill debe seguir siendo portable y basada en Markdown.

## Diseño de la extensión

La mejora recomendada se divide en tres referencias progresivas: `references/elite-architecture-review.md` para revisión estructural y rendimiento; `references/agent-evaluation-lab.md` para pruebas aisladas, scoring y evidencia segura; `references/multimodal-memory-design.md` para contexto multimodal y memoria compacta. El SKILL.md sólo debe contener un router breve y triggers claros para no romper el límite de 500 líneas.
