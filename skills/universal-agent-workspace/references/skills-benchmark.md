# Skills benchmark / Benchmark de skills

## Scope / Alcance

This comparison evaluates public repositories by adoption, maintenance, portability, progressive disclosure, quality gates, security and usefulness for a single portable skill. Stars are a signal of adoption, not proof of quality.

Esta comparación evalúa repositorios públicos por adopción, mantenimiento, portabilidad, divulgación progresiva, puertas de calidad, seguridad y utilidad para una skill portable única. Las estrellas indican adopción, no demuestran calidad.

## Snapshot / Fotografía

| Repository / Repositorio | Stars at review / Estrellas | Strongest lesson / Lección más fuerte | What not to copy / Qué no copiar |
| --- | ---: | --- | --- |
| `addyosmani/agent-skills` | 89,967 | Lifecycle skills, multi-host paths, evaluations, security references, link gates and skill linting. | Its repository-scale plugin and hook surface when a portable SKILL.md is enough. |
| `VoltAgent/awesome-agent-skills` | 32,536 | Curated discovery, broad host compatibility, trigger keywords, scoped tools and progressive disclosure. | Treating a curated list as audited; it explicitly warns that entries may change. |
| `agentsmd/agents.md` | 23,916 | Simple, predictable repository context with nested scope and host-neutral Markdown. | Putting all project-specific context into one global skill. |
| `google/skills` | 18,710 | Official, domain-specific, active skills with installation selection and product expertise. | Provider-specific knowledge in the universal core. |
| `muratcankoylan/Agent-Skills-for-Context-Engineering` | 17,837 | Context degradation, compaction, memory, evaluation, harness engineering and progressive disclosure. | Self-evolving or long-horizon machinery without a host that can enforce it. |

## Decision / Decisión

The user's skill is stronger as a universal operating method than as a large provider-specific catalog. It should keep one portable `SKILL.md`, but move advanced detail into references and expose a clear router contract. This preserves immediate portability while avoiding a mega-prompt.

La skill del usuario es más fuerte como método operativo universal que como catálogo específico de proveedores. Debe conservar un único `SKILL.md` portable, mover el detalle avanzado a referencias y exponer un contrato de routing claro. Así mantiene portabilidad inmediata sin convertirse en un mega-prompt.

## Improvements applied / Mejoras aplicables

1. Add Phase 0 scope mapping before capability selection: objective, target, constraints, risk, tools, available references, out of scope and acceptance.
2. Treat descriptions as matching interfaces: name the problem and trigger terms in third person inside metadata, while keeping the repository README human and first-person.
3. Require reference integrity: relative links, no machine-specific absolute paths, source URL, access date and uncertainty label.
4. Add a host-neutral compatibility note: the same Markdown can be placed in each agent's skill directory; host manifests remain optional adapters.
5. Add evaluation gates: discoverability, instruction adherence, context efficiency, safety, evidence quality and task outcome.
6. Preserve a hard rule that curated upstream collections are references, not audited executable code.

## Anti-regressions / Anti-regresiones

Do not turn this skill into a gateway, plugin marketplace, autonomous self-modifier, provider lock-in, unbounded research agent or mandatory microservice architecture. Do not load the full catalog or every reference by default. Do not claim that a Markdown rule can enforce a real permission, sandbox, token meter or circuit breaker.

## Sources / Fuentes

- https://github.com/addyosmani/agent-skills
- https://github.com/VoltAgent/awesome-agent-skills
- https://agents.md/
- https://github.com/google/skills
- https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering

Reviewed 2026-08-26. / Revisado el 2026-08-26.
