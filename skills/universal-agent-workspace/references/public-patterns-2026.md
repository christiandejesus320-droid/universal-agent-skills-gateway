# Public Agent Patterns 2026 / Patrones Públicos de Agentes 2026

This reference is comparative research, not a dependency list. Use it when the user asks how the skill compares with current model, benchmark, multimodal assistant or agent-framework patterns.

## Public references / Referencias públicas

| Reference / Referencia | Public pattern / Patrón público | What Universal Agent Workspace adds / Qué añade esta skill |
| --- | --- | --- |
| [GPT-5.6-Cyber model documentation](https://developers.openai.com/api/docs/models/gpt-5.6-cyber) | Specialized authorized security research, reasoning, tools, structured outputs, MCP, hosted shell and skills. / Investigación de seguridad autorizada, razonamiento, herramientas, salidas estructuradas, MCP, shell alojado y skills. | Provider-neutral routing, explicit authorization, no inferred permissions, smallest tool set and human checkpoints. / Routing neutral, autorización explícita, sin permisos inferidos, mínimo conjunto de herramientas y checkpoints humanos. |
| [ExploitGym paper](https://arxiv.org/abs/2605.11086) | Reproducible containerized benchmark, staged exploitation tasks, varied protections and measurable success. / Benchmark reproducible contenerizado, tareas por etapas, protecciones variables y éxito medible. | Safe evaluation lab for defensive fixtures, scope scoring, evidence, failure modes and no offensive operational content. / Laboratorio seguro para fixtures defensivos, scoring de alcance, evidencia y fallos sin contenido ofensivo operativo. |
| [Project Astra](https://deepmind.google/models/project-astra/) | Multimodal memory and context across interactions for a universal assistant direction. / Memoria multimodal y contexto entre interacciones para un asistente universal. | Progressive modality loading, compact memory layers, uncertainty fields, privacy redaction and retention limits. / Carga progresiva, capas de memoria compactas, incertidumbre, redacción de privacidad y límites de retención. |
| [Mastra](https://mastra.ai/) | Typed TypeScript agents, workflows, memory, workspaces, MCP, observability and evaluation. / Agentes TypeScript tipados, workflows, memoria, workspaces, MCP, observabilidad y evaluación. | Markdown portability across models and hosts, no runtime dependency, explicit state transitions, token budget and resource-on-demand policy. / Portabilidad Markdown, sin runtime obligatorio, estados explícitos, presupuesto de tokens y carga bajo demanda. |

## How the skill surpasses a single reference / Cómo supera una referencia aislada

Universal Agent Workspace is not trying to beat a model on one benchmark or reproduce a proprietary product. It improves the operating layer around any model by combining five properties in one portable skill:

1. **Model neutrality:** prompts describe goals, contracts and evidence rather than model-specific magic words.
2. **Progressive disclosure:** the core remains small; architecture, evaluation and multimodal memory load only on trigger.
3. **Controlled agency:** every tool call has scope, authorization, stop conditions and a reversible path where possible.
4. **Measurable work:** correctness, safety, scope, efficiency and recovery are scored separately instead of hiding failures behind one quality label.
5. **Human product quality:** UI and spatial work must explain a relationship, expose state, respect accessibility and preserve a fallback.

## Comparison prompt / Prompt de comparación

```text
Compara la capacidad solicitada con patrones públicos, no con marketing.

reference: "..."
problem_to_solve: "..."
portable_pattern: "..."
provider_specific_detail_to_exclude: ["...", "..."]
security_boundary: "authorized, isolated, defensive"
minimal_implementation: "..."
validation: ["reproducible fixture", "acceptance test", "evidence"]

Explica qué añade Universal Agent Workspace: menos contexto innecesario, más límites explícitos, mejor trazabilidad y una salida que otro modelo pueda ejecutar.
```

## Research discipline / Disciplina de investigación

Verify the official or primary source before adopting a claim. Record date, URL, scope and uncertainty. Do not treat a model name, benchmark score, product page or framework feature as a guarantee of safety or quality. Extract principles; do not copy proprietary prompts, hidden instructions, credentials, exploit chains or brand identity.
