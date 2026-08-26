# Universal Design & UI Skill Library

Estoy construyendo un framework de ejecución para agentes y LLMs que evita que la IA empiece a escribir código o actuar a ciegas en cuanto recibe una orden. El flujo obliga al modelo a entender el objetivo, analizar el contexto disponible, investigar sólo lo que hace falta, proponer un plan corto con límites claros y ejecutar la solución sin sobreingeniería ni consumo fantasma de contexto.

Mi objetivo es llevar este método a un nivel donde cualquier modelo pueda trabajar como un verdadero copiloto técnico: preciso antes de ser autónomo, capaz de explicar qué está haciendo, limitado por el alcance real de la tarea y obligado a validar el resultado antes de terminar. La skill principal es portable y no necesita una gateway, un proveedor específico, un servidor ni una API para funcionar.

## Qué incluye el proyecto

| Componente | Función | Estado |
| --- | --- | --- |
| `skills/universal-agent-workspace/SKILL.md` | Skill única y portable para agentes y LLMs | Implementado |
| `catalog/skills.json` | Índice interno de 100 capacidades seleccionables | Implementado |
| `skills/universal-agent-workspace/references/maps/` | Mapas conceptuales de selección, ejecución, UI y errores | Implementado |
| `skills/universal-agent-workspace/references/images/` | Imagen práctica para explicar el método | Implementado |
| `src/registry.ts` | Adaptador opcional para descubrir y validar skills | Implementado |
| `src/server.ts` | Adaptador opcional de catálogo y consultas | Implementado |
| `.github/workflows/quality.yml` | Validación automática del repositorio | Implementado |

La estructura sigue la especificación Agent Skills: cada skill tiene un directorio con `SKILL.md`, frontmatter YAML con `name` y `description`, y recursos opcionales separados para carga progresiva [1]. Vercel Skills ya demuestra un patrón de instalación a múltiples agentes, con symlink/copia, fuentes Git y detección de hosts [2]. gstack aporta el modelo de flujo completo `think → plan → build → review → test → ship → reflect`, además de QA, seguridad, navegador, documentación, benchmarking y coordinación multiagente [3].

## Instalación local

```bash
git clone <tu-repositorio> universal-agent-skills
cd universal-agent-skills
node --version                    # Node 22+
chmod +x bin/uaskills.mjs
npm run validate
node bin/uaskills.mjs list
```

El proyecto no incluye credenciales. Configura sólo en el proceso del gateway:

```bash
export OPENAI_API_KEY="..."
export OPENAI_MODEL="gpt-4.1-mini"
export ANTHROPIC_API_KEY="..."
export ANTHROPIC_MODEL="claude-sonnet-4-20250514"
export GOOGLE_API_KEY="..."
export OPENROUTER_API_KEY="..."
export OPENROUTER_MODEL="openai/gpt-4.1-mini"
export LOCAL_LLM_BASE_URL="http://127.0.0.1:11434/v1"
export LOCAL_LLM_MODEL="llama3.2"
export GATEWAY_TOKEN="cambia-este-token-en-produccion"
```

Inicia el gateway:

```bash
npm start
curl http://127.0.0.1:8787/health
node bin/uaskills.mjs models
node bin/uaskills.mjs run universal-workspace "Diseña el plan de revisión de una API multi-tenant."
```

Para añadir skills locales, define `SKILL_ROOTS` con rutas separadas por comas. El runtime valida nombre, descripción y coincidencia con el directorio, y omite skills inválidas en lugar de ejecutarlas silenciosamente.

```bash
export SKILL_ROOTS="$PWD/skills,$HOME/.agents/skills,$HOME/.claude/skills"
```

## Integración con agentes

La skill portable se instala mediante la CLI de Vercel Skills o copiando el directorio `skills/universal-workspace` al directorio que el agente soporte. La configuración MCP genérica se obtiene con:

```bash
node bin/uaskills.mjs mcp-config
```

El endpoint MCP es:

```text
http://127.0.0.1:8787/mcp
```

El gateway expone `skills_list`, `models_list` y `chat`. Para agentes que sólo soportan prompts, utiliza la misma `SKILL.md` y llama a la API HTTP. Para agentes que soportan herramientas, MCP ofrece descubrimiento estructurado y un único punto de entrada. Esta doble superficie evita depender de un formato privado de Claude.

## API de streaming

```bash
curl -N http://127.0.0.1:8787/v1/chat/completions \
  -H "Authorization: Bearer $GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skill": "universal-workspace",
    "provider": "openrouter",
    "model": "openai/gpt-4.1-mini",
    "messages": [{"role":"user","content":"Revisa este diseño y devuelve riesgos."}],
    "stream": true
  }'
```

La capa usa el formato de chat completions OpenAI-compatible para los proveedores configurados. Anthropic, Google, OpenRouter y servidores locales que expongan ese contrato pueden conectarse mediante `*_BASE_URL`, `*_API_KEY` y `*_MODEL`. En producción, añade un adaptador específico cuando un proveedor no implemente exactamente ese contrato; no fuerces transformaciones ambiguas dentro de una skill.

## Arquitectura de producción

```text
Agent / IDE / CLI / MCP client
              |
       TLS + auth + rate limit
              |
      Universal Skills Gateway
       |        |        |
   Registry  Policy   Model Router
       |        |        |
  SKILL.md  audit   OpenAI / Anthropic / Google / OpenRouter / Local
              |
        SSE stream + receipts
```

El gateway de esta entrega es un proceso Node.js con SSE y fallback secuencial. Para una instalación 24/7, ejecútalo detrás de TLS, un proxy con límites de tamaño y tasa, un almacén de auditoría append-only y un gestor de secretos. No expongas directamente el puerto sin autenticación.

## Catálogo de 100 skills

El catálogo combina capacidades de gstack, fuentes visibles en skills.sh, Anthropic Skills, Vercel Agent Skills, Prisma, Supabase, Microsoft Azure, Matt Pocock, Firebase, Remotion, RunComfy y otras fuentes públicas. La clasificación se hizo por **utilidad operativa**, **madurez o adopción observable**, **cobertura de ciclo de vida** y **riesgo de ejecución**. Las entradas son candidatas referenciales: deben fijarse a commit, pasar revisión de licencia, escaneo de prompt injection y sandbox de scripts antes de permitir ejecución externa automática.

El archivo `catalog/skills.json` contiene el origen, repositorio, categoría, resumen, base de selección y estado. No se copian los contenidos de las 100 skills en este repositorio base; eso evita cambiar upstream, reduce duplicación y permite actualizar por lockfile o mirror verificado.

## Seguridad y límites

La solución separa la selección de una skill de su ejecución. Por defecto, el catálogo no ejecuta código remoto. Las acciones destructivas, publicación, pago, escritura externa, uso de cookies o modificación de producción requieren una política y confirmación humana. Añade en producción una allowlist de hosts, un sandbox de procesos, límites de CPU/memoria/tiempo, egress receipts con hash encadenado y logs sin secretos.

### Alternativas de ejecución persistente

| Enfoque | Tradeoffs | Coste | Complejidad de instalación |
| --- | --- | --- | --- |
| Ejecutarlo localmente en la máquina del equipo | Máximo control y privacidad; debe permanecer encendida y requiere operar actualizaciones | Sin coste de infraestructura adicional | Baja |
| Desplegarlo en un servicio gestionado con proceso persistente | HTTPS, reinicio y operación simplificados; límites de CPU/memoria y coste de instancia reservada | Uso mensual según proveedor y modalidad | Media |
| Desplegarlo en una VM/cloud con Docker y Redis/cola | Control total, workers, observabilidad y escalado; exige hardening, backups y mantenimiento | Coste de VM, almacenamiento, tráfico y servicios auxiliares | Alta |

Para una prueba real, empieza localmente. Para un equipo que necesite acceso continuo y streaming, elige un servicio gestionado persistente si sus límites son suficientes. Usa una VM sólo si necesitas Docker, runtime del sistema, IP fija o recursos que el servicio gestionado no ofrece.

## Preservación de upstream

Los repositorios auditados se mantienen fuera del código modificado. Si quieres fijarlos como submódulos readonly:

```bash
git submodule add https://github.com/garrytan/gstack.git upstream/gstack
git submodule add https://github.com/vercel-labs/skills.git upstream/vercel-skills
git submodule update --init --recursive
```

El gateway sólo consume sus artefactos, genera adaptadores y conserva la versión fijada. Nunca ejecutes `setup` de gstack contra una ruta que contenga archivos de usuario sin inspeccionar primero sus efectos.

## Próximas mejoras recomendadas

La siguiente iteración debe añadir un lockfile de skills con commit y hash SHA-256, un escáner de frontmatter y scripts, un sandbox por skill, Redis o una cola durable para ejecuciones largas, OpenTelemetry, cuotas por tenant, almacenamiento de sesiones y adaptadores nativos de Anthropic/Google. También conviene verificar automáticamente cada entrada del catálogo contra su repositorio actual y reemplazar cualquier skill retirada, renombrada o con licencia incompatible.

## Referencias

[1]: https://agentskills.io/specification "Agent Skills Specification"

[2]: https://github.com/vercel-labs/skills "Vercel Skills CLI"

[3]: https://github.com/garrytan/gstack "gstack — software factory for Claude Code and other agents"

[4]: https://www.skills.sh/ "The Agent Skills Directory"

## Skill única portable / Portable single skill

La entrega principal para cualquier modelo es `skills/universal-agent-workspace/SKILL.md`. El paquete independiente `/home/ubuntu/universal-agent-workspace/` contiene únicamente ese archivo. Puede copiarse como una carpeta de skill en cualquier agente que soporte el formato Agent Skills; no necesita instalar Node.js, Python, Webpack, Pylint, MCP, un gateway ni una API.

The primary deliverable for any model is `skills/universal-agent-workspace/SKILL.md`. The standalone package contains only that file and can be copied into any Agent Skills-compatible agent. It is an instruction layer, not a server or provider integration. The optional catalog UI and server remain separate support tooling and are not required to use the skill.
