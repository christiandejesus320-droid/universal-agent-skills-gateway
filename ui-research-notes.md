# UI library research notes

## W3C WCAG 2.2

WCAG 2.2 es una recomendación W3C publicada el 12 de diciembre de 2024. Define principios perceivable, operable, understandable y robust; sus criterios son testables y aplican a distintos dispositivos. Para esta biblioteca se traducen en foco visible, contraste suficiente, interacción por teclado, target táctil, estados comunicados y compatibilidad con contenido dinámico.

Fuente: https://www.w3.org/TR/WCAG22/

## MCP specification 2026-07-28

La especificación MCP 2026-07-28 define una integración basada en JSON-RPC 2.0 entre hosts, clients y servers. Los servers pueden exponer resources, prompts y tools. Las herramientas usan JSON Schema y deben tratarse con consentimiento explícito, autorización y controles de privacidad. Las extensiones incluyen tasks para trabajo largo y MCP Apps para UI interactiva.

Fuente: https://modelcontextprotocol.io/specification/2026-07-28

## Remotion + Three.js

`@remotion/three` integra React Three Fiber con Remotion mediante `ThreeCanvas`, permite animar desde el markup con hooks de frame y ofrece `ThreeWebGPUCanvas`. Remotion documenta el uso de `layout="none"` para `Sequence` dentro de canvas y la configuración de Chromium/ANGLE para renderizado SSR.

Fuente: https://www.remotion.dev/docs/three
Fuente relacionada: https://github.com/pmndrs/react-three-fiber

## Dirección de la biblioteca

La biblioteca será declarativa y portable. La UI servirá como catálogo humano, mientras cada skill tendrá un contrato bilingüe `problem`, `purpose`, `when_to_use`, `avoid_when`, `inputs`, `outputs`, `tokens`, `states`, `accessibility`, `examples` y `mcp`. MCP se mantendrá como adaptador opcional de consulta/preview, no como núcleo de ejecución.

## Inspección visual del prototipo

La interfaz renderizada muestra correctamente un shell de tres columnas en escritorio con rail de navegación de 260px, canvas principal e inspector lateral; el hero comunica el propósito de la biblioteca, el catálogo tiene filtros por nivel, y existen vistas de Tokens, Playground y MCP Context. La vista textual confirma que el layout incluye los estados Idle, Loading, Success y Error, además de los tres nombres de herramientas MCP. El acceso visual temporal se verificó en el servidor local expuesto.

## Token economy research for universal skill

Anthropic defines context engineering as curating the smallest possible set of high-signal tokens for the desired outcome and warns that larger context can reduce focus through context rot and limited attention budget. It recommends just-in-time context, progressive disclosure, clear system sections and compaction for long-running agent sessions.

Martin Fowler distinguishes instructions from guidance and treats skills as context interfaces that should be loaded on demand. He recommends gradual growth, scoped rules, transparency about context usage and avoiding indiscriminate context dumps.

Applied rule for this repository: separate intent, plan, research, execution and validation; use exact queries; prefer patches over full rewrites; transfer only validated net artifacts between sub-agents; stop immediately at the hard definition of done.

Sources:
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html

## Engineering standards research

- TypeScript official documentation: `strict` enables a broad family of type checks that provide stronger correctness guarantees; future TypeScript versions may add stricter checks, so the skill should require strict mode but verify project-specific compatibility.
- OWASP ASVS is a basis for testing web application security controls and provides developer requirements for secure development. Its v5.0.0 requirements include injection prevention and explicit versioned references.
- Applied rule: treat strict typing, runtime validation, input sanitization, authorization, parameterized queries and versioned security checks as requirements when the task actually involves them, not as unconditional implementation of infrastructure.
- Sources: https://www.typescriptlang.org/tsconfig/strict.html ; https://owasp.org/www-project-application-security-verification-standard/
