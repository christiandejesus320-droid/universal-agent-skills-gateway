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

## Luxury design research: Mazarine and Studio Freight

Mazarine presents luxury as a coordinated system across brand strategy, campaigns, content, agentic AI, digital innovation, product design, packaging, experiences and culture. Transferable principles: craft a coherent brand territory across touchpoints, combine creativity with technology, make detail and tailored solutions explicit, and treat experience as a full system rather than a single screen.

Studio Freight frames its work as mission-driven and contextual: strategy, design and technology move a partner from its current state to a desired state. Its identity combines a simple symbolic mark with narrative depth and a flexible visual language described as schematic surrealism, balancing clarity and uncertainty. Transferable principles: define the mission before the artifact, let constraints shape the route, use one memorable visual grammar, and pair collaboration with purposeful execution.

Sources: https://www.mazarine.com/en ; https://studiofreight.com/work/studio-freight

## Luxury design research: Immersive Garden and Pentagram

Immersive Garden's project index spans design, technology, branding, strategy, experience, 3D, ecommerce, film, NFT and Web3. Transferable principle: treat 3D and interaction as part of a broader experience system, route the medium to the story, and keep technology subordinate to meaning.

Pentagram describes its work as designing everything for everyone and emphasizes discovery, fresh expression, meaning for the client and typography as a carrier of voice and emotion. Transferable principles: let each project find its truest expression instead of forcing a house style, use typography as semantic structure, and evaluate design by meaning and fit rather than novelty alone.

Sources: https://immersive-g.com/projects/ ; https://www.pentagram.com/

## Luxury design research: Resn and Locomotive

Resn positions its work around bringing stories to life across brand, content, experience and digital, with technology innovation as a visible category. Transferable principles: begin with narrative intent, make the medium serve the story, and connect brand, content and interaction instead of treating them as isolated deliverables.

Locomotive describes design and code as tools of expression, with people as the differentiator. It emphasizes bespoke digital-first brand identities and experiences tailored to audience, and an end-to-end relationship from strategy through deployment and maintenance. Transferable principles: preserve human and audience context, make design and engineering one accountable craft, and design for the complete lifecycle rather than the launch screenshot.

Sources: https://resn.co.nz/ ; https://locomotive.ca/en

## Luxury design research: Siteinspire and Awwwards

Siteinspire structures inspiration through searchable, curated filters such as popular categories, styles, types, subjects and platforms. Its visible categories include typography, art direction, portfolio, interactive design, ecommerce, minimal and grid design. Transferable principles: make inspiration searchable by intent, separate visual style from product type, and expose metadata that helps a designer select a relevant precedent quickly.

Awwwards combines discovery, nominees, winners, education, collections, directory and marketplace. It exposes a public score and uses categories around web design, UX/UI, animation and technology. Transferable principles: evaluate craft across multiple dimensions, separate inspiration from learning and delivery, and turn subjective quality into an explicit review rubric without treating the score as absolute truth.

Sources: https://www.siteinspire.com/ ; https://www.awwwards.com/
