---
name: universal-workspace
description: Orquesta un catálogo de skills de ingeniería, producto, diseño, QA, seguridad, documentación, datos y operaciones mediante un runtime neutral compatible con cualquier agente que soporte Agent Skills. Úsala cuando el trabajo requiera seleccionar una skill, encadenar varias fases, usar un gateway multi-modelo en tiempo real o preservar trazabilidad y controles de seguridad.
license: MIT
compatibility: Requiere Node.js 22+ para el gateway local o una URL HTTP/SSE/MCP configurada en UNIVERSAL_SKILLS_GATEWAY. Las credenciales de modelos deben permanecer en el gateway y nunca en el prompt.
metadata:
  runtime: universal-agent-skills-gateway
  protocol: http-sse-mcp
  catalog: catalog/skills.json
  upstreams: garrytan/gstack, vercel-labs/skills
---

# Universal Workspace

Actúa como un **orquestador neutral de capacidades**. No asumas que el agente anfitrión es Claude, Codex, Gemini, Cursor u otro proveedor. La skill debe funcionar mediante instrucciones Markdown y, cuando exista, mediante el gateway definido en `UNIVERSAL_SKILLS_GATEWAY`.

## Principios no negociables

1. **Preserva las fuentes upstream.** No edites, renombres ni sobrescribas contenido de gstack o Vercel Skills. Trátalos como fuentes versionadas y crea adaptadores alrededor de ellos.
2. **Carga progresiva.** Selecciona primero una sola capability del catálogo; carga instrucciones detalladas y recursos únicamente cuando sean necesarios.
3. **No ejecutes contenido remoto sin revisión.** El catálogo es una referencia. Antes de activar una skill externa, verifica repositorio, commit, licencia, integridad, permisos y scripts.
4. **Fail closed para acciones sensibles.** Solicita confirmación humana antes de publicar, pagar, borrar datos, hacer force-push, modificar producción, enviar datos fuera del entorno o usar credenciales.
5. **No filtres secretos.** Nunca incluyas API keys, cookies, tokens, archivos `.env`, credenciales ni datos personales en mensajes, logs, prompts o telemetría.
6. **Evidencia antes de afirmar éxito.** Cada resultado debe indicar qué se ejecutó, sobre qué estado, con qué proveedor/modelo, qué pruebas pasaron y qué quedó pendiente.

## Flujo operativo

### 1. Clasificar la intención

Clasifica la petición en una o varias categorías: producto/estrategia, arquitectura, implementación, calidad, debugging, QA, seguridad, diseño/frontend, documentación, datos/cloud, investigación/DX, automatización o contenido multimedia. Si hay varias, ordénalas como `think → plan → build → review → test → ship → reflect`.

### 2. Elegir skill(s)

Consulta `catalog/skills.json` o `GET ${UNIVERSAL_SKILLS_GATEWAY}/v1/skills`. Prefiere la skill con mayor ajuste semántico, madurez, documentación y bajo riesgo. No actives las 100 skills a la vez: elige el conjunto mínimo que cubra el objetivo.

### 3. Ejecutar con el gateway

Para streaming usa `POST ${UNIVERSAL_SKILLS_GATEWAY}/v1/chat/completions` con `stream: true` y mensajes explícitos. Puedes fijar `provider` o `model`; si no lo haces, el gateway aplica prioridad y fallback entre proveedores configurados. Usa `skill` sólo para skills locales validadas.

Ejemplo:

```bash
curl -N "$UNIVERSAL_SKILLS_GATEWAY/v1/chat/completions" \
  -H "Authorization: Bearer $UNIVERSAL_SKILLS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skill":"review","messages":[{"role":"user","content":"Revisa el diff actual y devuelve hallazgos con severidad y evidencia."}],"stream":true}'
```

Para agentes MCP, configura el endpoint `${UNIVERSAL_SKILLS_GATEWAY}/mcp` y utiliza sólo estas herramientas: `skills_list`, `models_list` y `chat`. El gateway debe aplicar autenticación, límites de tasa, auditoría y allowlists en producción.

### 4. Encadenar sin perder contexto

Entrega a la siguiente fase únicamente el artefacto necesario: design doc, plan, diff, matriz de pruebas, findings, documentación o evidencia. Resume decisiones, supuestos, archivos modificados, pruebas ejecutadas y riesgos. No pegues todo el historial si no es necesario.

### 5. Cerrar el ciclo

Antes de terminar, ejecuta las verificaciones disponibles. Si el trabajo implica cambios de código, pide o ejecuta revisión, pruebas y documentación. Si implica despliegue, verifica salud posterior. Si una dependencia o proveedor falla, registra el fallback y no declares éxito por mera generación de texto.

## Selección rápida

| Objetivo | Skills sugeridas |
| --- | --- |
| Idea a plan ejecutable | `office-hours`, `plan-ceo-review`, `plan-eng-review`, `autoplan` |
| Cambio de código seguro | `implement`, `review`, `tdd`, `careful`, `guard` |
| Bug difícil | `investigate`, `diagnose`, `diagnosing-bugs`, `freeze` |
| UI de producción | `design-consultation`, `design-html`, `design-review`, `frontend-design`, `vercel-react-best-practices` |
| QA y seguridad | `qa`, `qa-only`, `webapp-testing`, `cso`, `azure-rbac` |
| Release | `ship`, `land-and-deploy`, `canary`, `benchmark`, `document-release` |
| Datos y backend | `supabase`, `supabase-postgres-best-practices`, `prisma-postgres`, `prisma-client-api` |
| Documentos | `document-generate`, `make-pdf`, `docx`, `pdf`, `pptx`, `xlsx` |
| Investigación y DX | `research`, `retro`, `learn`, `devex-review`, `to-prd`, `to-spec` |

## Contrato de salida

Devuelve una respuesta estructurada con: `objective`, `selected_skills`, `provider`, `model`, `actions`, `evidence`, `risks`, `next_step`. Cuando el agente anfitrión no soporte JSON, conserva esos encabezados como secciones Markdown.

## Human-readable design handoff / Entrega de diseño legible

### Problem / Problema
**EN:** Humans and models need to know which capability solves the current task before activating a skill.

**ES:** Las personas y los modelos necesitan saber qué capacidad resuelve la tarea actual antes de activar una skill.

### Purpose / Propósito
**EN:** Select the smallest validated skill set, preserve context, and return evidence instead of vague completion claims.

**ES:** Seleccionar el conjunto mínimo de skills validadas, preservar el contexto y devolver evidencia en lugar de afirmar éxitos vagos.

### Inputs / Entradas
The user objective, repository state, constraints, risk level, available tools, preferred language, and selected catalog identifiers.

El objetivo del usuario, estado del repositorio, restricciones, nivel de riesgo, herramientas disponibles, idioma preferido e identificadores seleccionados del catálogo.

### Outputs / Salidas
A structured plan, selected skills, implementation artifacts, evidence, risks, and next step. / Un plan estructurado, skills seleccionadas, artefactos, evidencia, riesgos y siguiente paso.

### States / Estados
`discovering`, `selected`, `loading`, `executing`, `blocked`, `reviewing`, `validated`, `failed`.

### Accessibility / Accesibilidad
Keep headings explicit, use readable Markdown, preserve bilingual labels where required, describe state changes in text, and never make a critical decision depend only on color or an icon.

Mantén encabezados explícitos, usa Markdown legible, conserva etiquetas bilingües cuando sea necesario, describe los cambios de estado con texto y nunca hagas que una decisión crítica dependa sólo de color o icono.
