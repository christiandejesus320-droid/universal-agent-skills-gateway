# Elite engineering standards / Estándares de ingeniería

Read this reference only when the task involves application architecture, production code, UI systems, AI integrations, data systems, background jobs, security or deployment. Do not load it for simple explanations or small text edits.

## Architecture before code / Arquitectura antes del código

Design the boundary before implementation. Prefer a modular monolith, serverless boundary or service boundary when justified by the problem. Keep each module, class and function responsible for one concern. Do not introduce microservices merely because they sound advanced.

Diseña los límites antes de implementar. Prefiere un modulith, una frontera serverless o un servicio separado sólo cuando el problema lo justifique. Mantén una responsabilidad por módulo, clase y función. No introduzcas microservicios sólo porque suenen avanzados.

For external APIs and background work, define timeout, retry with exponential backoff, jitter, bounded attempts, circuit breaking and a graceful fallback only when failure is plausible and the host can support them.

Para APIs externas y trabajos en segundo plano, define timeout, retry con backoff exponencial, jitter, intentos acotados, circuit breaker y fallback elegante sólo cuando el fallo sea plausible y el host pueda soportarlo.

## Typed boundaries / Fronteras tipadas

Use strict TypeScript, Rust or Go when that is the project stack. Validate untrusted input at runtime with the stack's established schema tool such as Zod, TypeBox or Pydantic. Do not use `any`, implicit conversions or unvalidated external data. Prefer streams, async generators and cursor pagination for large data. Check algorithmic complexity and avoid dynamic O(n²) loops unless justified by measured constraints.

Usa TypeScript estricto, Rust o Go según el stack existente. Valida entradas no confiables en runtime con la herramienta del stack, como Zod, TypeBox o Pydantic. No uses `any`, conversiones implícitas ni datos externos sin validar. Prefiere streams, async generators y paginación por cursor para datos grandes. Revisa complejidad y evita O(n²) dinámico salvo justificación medida.

## Defensive production coding / Código defensivo de producción

Sanitize at the application boundary. Use parameterized queries and safe process APIs. Separate capability from permission. Make mutations idempotent with idempotency keys when retries or duplicate delivery are possible. Use structured logs with correlation fields such as `trace_id` and `span_id` when observability exists; do not pretend to provide OpenTelemetry if the host does not support it.

Sanitiza en la frontera. Usa consultas parametrizadas y APIs seguras de procesos. Separa capability de permiso. Haz idempotentes las mutaciones con idempotency keys cuando haya reintentos o entregas duplicadas. Usa logs estructurados con campos como `trace_id` y `span_id` cuando exista observabilidad; no finjas OpenTelemetry si el host no lo soporta.

Use dependency injection through interfaces where mocking or provider substitution is needed. Model complex business transitions as explicit finite state machines. Use atomic transactions for multi-step data changes and indexes for read paths after measuring the query pattern.

Usa inyección de dependencias mediante interfaces cuando se necesite mocking o sustituir proveedores. Modela transiciones complejas como máquinas de estado finitas. Usa transacciones atómicas para cambios multietapa e índices en lecturas después de medir el patrón de consulta.

## UI defaults / Defaults de UI

When building UI, use an 8px spacing rhythm and 4px only for compact internal detail. Use readable type, clear hierarchy, minimum 40px desktop and 48px mobile targets where applicable, visible focus, keyboard operation, explicit states and reduced-motion behavior. OLED dark and high contrast are defaults, not excuses to reduce legibility. Validate against the project's design system and accessibility requirements.

Al construir UI, usa ritmo de 8px y 4px sólo para detalle interno compacto. Usa tipografía legible, jerarquía clara, objetivos mínimos de 40px en desktop y 48px en mobile cuando aplique, foco visible, teclado, estados explícitos y reduced motion. OLED y alto contraste son defaults, no excusas para perder legibilidad.

## AI, audio and video integrations / Integraciones de IA, audio y vídeo

Stream model responses only when it improves perceived latency or interaction. Use structured outputs with a runtime schema for machine-consumed responses. Chunk long speech input by meaningful boundaries and cache generated assets when regeneration is expensive. For Remotion or Three.js, separate preview from rendering and preserve the requested resolution, frame rate and delivery target. Verify current provider APIs before implementation.

Transmite respuestas sólo cuando mejore latencia o interacción. Usa structured outputs con schema runtime para respuestas consumidas por máquinas. Divide audio largo por unidades significativas y cachea assets costosos. En Remotion o Three.js separa preview y render y conserva resolución, frame rate y destino solicitados. Verifica APIs actuales antes de implementar.

## Build order / Orden de construcción

For a new full-stack product, use this order only when the task requires it: data model and contracts, application shell and design tokens, state and business logic, UI composition and polish, then testing, security review and delivery. For a small change, skip irrelevant phases.

Para un producto full-stack nuevo, usa este orden sólo si la tarea lo requiere: modelo de datos y contratos, shell y tokens, estado y lógica, composición y pulido UI, después testing, revisión de seguridad y entrega. Para un cambio pequeño, omite fases irrelevantes.

## Evidence / Evidencia

For each applicable rule, report the smallest useful evidence: typecheck, schema result, test, query plan, accessibility check, benchmark, log trace or deployment result. If a production mechanism is unavailable, state the limitation instead of inventing it.
