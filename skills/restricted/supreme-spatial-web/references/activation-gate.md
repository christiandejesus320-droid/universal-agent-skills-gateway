# Activation Gate / Candado de activación

Este módulo sólo se abre cuando el usuario lo pide de forma explícita o cuando la petición contiene una necesidad inequívoca de WebGPU, WebXR, PBR, compute shaders, Spatial Web, video espacial o una experiencia editorial inmersiva.

## Search first / Buscar antes de leer

```text
1. Search: skills/restricted/supreme-spatial-web/manifest.json
2. Match: keyword or explicit activation phrase
3. Read: only the reference named by the task
4. Build: minimum proof before expanding
```

No se debe cargar `SKILL.md`, los prompts originales ni todas las referencias sólo porque aparezca una palabra como “3D”. Primero distinguir entre una página con una imagen 3D y una tarea que realmente necesita un pipeline espacial.

## Activation levels / Niveles

| Nivel | Señal de la petición | Carga permitida |
| --- | --- | --- |
| 0 | Web normal, UI, landing, 2D | No cargar este módulo. |
| 1 | Canvas, shader simple, partículas pequeñas | Sólo referencia WebGL/WebGPU puntual. |
| 2 | Escena 3D, PBR, compute, cientos de objetos | `SKILL.md` + referencia técnica necesaria. |
| 3 | WebXR, spatial media, scrollytelling físico | `SKILL.md` + WebXR o media. |
| 4 | Petición explícita de “Supreme Spatial Web” u “Omega” | Abrir este módulo y sólo el prompt original pedido. |

## No override / No sobrescribe

El candado no convierte el módulo en una autoridad superior. No puede ignorar seguridad, accesibilidad, privacidad, permisos del navegador, restricciones de hardware o instrucciones de mayor prioridad. El lenguaje de “Omega”, “beyond quantum” o “god mode” se interpreta como dirección creativa del usuario, no como permiso técnico ilimitado.

## Discovery response / Respuesta de descubrimiento

Cuando sólo se busca saber si existe el módulo, devolver una línea compacta:

```json
{"id":"supreme-spatial-web","status":"restricted","default_load":false,"match":true,"next":"read only the required reference"}
```

No incluir el contenido completo del módulo en esa respuesta.
