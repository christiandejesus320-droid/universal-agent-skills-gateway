# PROMPT MAESTRO — WebGL Shader Background
### Estilo Anthropic / OpenAI · Con vista previa en vivo obligatoria
**Versión 2026 · Para agentes como Manus, Claude Code, Cursor**

---

## INSTRUCCIÓN RAÍZ (pega esto primero, siempre)

Eres un Senior GLSL Engineer y Frontend Architect especializado en efectos visuales de tiempo real para landing pages de startups de IA de nivel billonario (Anthropic, OpenAI, ElevenLabs, Vercel). Tu output siempre incluye una **vista previa funcional en vivo** en el mismo artefacto. Nunca entregas solo código estático.

---

## FASE 0 — COMPRENSIÓN ANTES DE ESCRIBIR

Antes de escribir una sola línea de GLSL, responde internamente:

1. **¿Qué sensación debe evocar?** (calma/energía/poder/misterio)
2. **¿Qué paleta de colores?** (especifica 3 colores base en vec3 RGB 0.0–1.0)
3. **¿Qué técnica principal?** (fBm / domain warp / ray march / metaballs / voronoi)
4. **¿Hay interacción con el mouse?** (sí = uniform vec2 u_mouse)
5. **¿Qué velocidad de animación?** (lenta=0.2 / media=0.5 / rápida=1.0 × tiempo)

---

## FASE 1 — ARQUITECTURA DEL PIPELINE (obligatorio entender)

El pipeline que debes implementar exactamente en este orden:

```
JS/CPU Loop (rAF)
    │
    ├── gl.uniform1f("u_time", t)          ← tiempo acumulado en segundos
    ├── gl.uniform2f("u_res", w, h)        ← resolución del canvas
    ├── gl.uniform2f("u_mouse", mx, my)    ← posición normalizada 0.0–1.0
    └── gl.drawArrays(TRIANGLE_STRIP, 0, 4) ← dispara el quad fullscreen
         │
         ▼
    VERTEX SHADER (trivial — solo posiciona el quad)
         │
         ▼
    RASTERIZACIÓN (GPU genera 1 fragmento por pixel)
         │
         ▼
    FRAGMENT SHADER — aquí vive toda la magia
         │
         ├── CAPA 1: Simplex Noise 3D (coordenadas + tiempo como z)
         ├── CAPA 2: fBm multioctava (5 octavas: amp*=0.5, freq*=2.1)
         ├── CAPA 3: Domain Warping (distorsionar UV con noise antes de evaluar)
         ├── CAPA 4: Metaballs / SDF (formas que se fusionan con smooth-min)
         ├── CAPA 5: Composición de color (mix entre 3 colores base)
         ├── CAPA 6: Vignette (1.0 - length(uv) * 0.6)
         └── CAPA 7: Gamma correction (pow(col, vec3(0.9)))
         │
         ▼
    gl_FragColor → Framebuffer → Pantalla
```

**Presupuesto de tiempo por frame (60fps = 16.6ms total):**
- JS / uniforms: ~0.4ms
- Fragment shader GPU: ~8–12ms (la mayoría del budget)
- Swap/display: ~0.2ms

---

## FASE 2 — BLOQUES DE CÓDIGO GLSL OBLIGATORIOS

### BLOQUE A — Simplex Noise 3D (SIEMPRE incluir completo, no resumir)

```glsl
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
```

### BLOQUE B — fBm multioctava (5 octavas = sweet spot calidad/performance)

```glsl
float fbm(vec3 p){
  float v=0.; float a=0.5;
  for(int i=0;i<5;i++){
    v+=a*snoise(p);
    p*=2.1;   // frecuencia × 2.1 (no 2.0 para evitar aliasing)
    a*=0.5;   // amplitud × 0.5
  }
  return v;
}
```

### BLOQUE C — Domain Warping (el secreto de Anthropic.com)

```glsl
// Basado en la técnica de Inigo Quilez (iquilezles.org/warp)
// f(g(p)) — evaluamos noise en coordenadas distorsionadas por otro noise

vec2 warp(vec2 uv, float t, float warpStrength) {
  // Primer nivel de warping
  vec2 q = vec2(
    fbm(vec3(uv + vec2(0.0, 0.0), t * 0.3)),
    fbm(vec3(uv + vec2(5.2, 1.3), t * 0.25))
  );
  // Segundo nivel (opcional, más orgánico)
  vec2 r = vec2(
    fbm(vec3(uv + 4.0*q + vec2(1.7, 9.2), t * 0.2)),
    fbm(vec3(uv + 4.0*q + vec2(8.3, 2.8), t * 0.15))
  );
  return uv + warpStrength * r;
}
```

### BLOQUE D — Metaballs (formas orgánicas que se fusionan)

```glsl
// Función de campo escalar por orbe
float metaball(vec2 p, vec2 center, float radius) {
  float d = length(p - center);
  return radius / (d * d + 0.001); // evitar división por cero
}

// Smooth-min para fusión suave entre SDFs (k controla suavidad)
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

// Ejemplo de uso en main():
float mb1 = metaball(uv, vec2(sin(t*0.7)*0.3, cos(t*0.5)*0.25), 0.08);
float mb2 = metaball(uv, vec2(cos(t*0.4)*0.35, sin(t*0.6)*0.3),  0.06);
float mb3 = metaball(uv, vec2(sin(t*0.9+1.2)*0.28, cos(t*0.7)*0.22), 0.05);
float meta = clamp((mb1 + mb2 + mb3) * 0.4, 0.0, 1.0);
```

### BLOQUE E — Ray Marching básico (para esferas estilo OpenAI)

```glsl
// SDF de esfera
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Escena SDF (combina múltiples SDFs con smooth-min)
float sceneSDF(vec3 p, float t) {
  float s1 = sdSphere(p - vec3(sin(t)*0.3, 0.0, 0.0), 0.5);
  float s2 = sdSphere(p - vec3(cos(t)*0.3, sin(t*0.7)*0.2, 0.0), 0.4);
  return smin(s1, s2, 0.2); // k=0.2 = fusión suave
}

// Ray marcher (max 64 pasos = balance calidad/performance)
vec2 rayMarch(vec3 ro, vec3 rd, float t) {
  float d = 0.0;
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * d;
    float hit = sceneSDF(p, t);
    if(abs(hit) < 0.001) return vec2(d, 1.0); // hit
    if(d > 20.0) break;                         // miss
    d += hit; // sphere tracing: avanza la distancia mínima segura
  }
  return vec2(d, 0.0);
}
```

### BLOQUE F — Post-processing (el toque premium)

```glsl
// Vignette (oscurece los bordes)
float vignette(vec2 uv) {
  return 1.0 - length(uv) * 0.6;
}

// Chromatic aberration (offset de canales RGB)
vec3 chromaticAberration(sampler2D tex, vec2 uv, float strength) {
  float r = texture2D(tex, uv + vec2(strength, 0.0)).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - vec2(strength, 0.0)).b;
  return vec3(r, g, b);
}

// Gamma correction (ACES-like, más cálido que linear)
vec3 gammaCorrect(vec3 col) {
  return pow(clamp(col, 0.0, 1.0), vec3(0.9)); // ligeramente más brillante
}

// Aplicación en main():
col *= vignette(uv);          // vignette
col = gammaCorrect(col);      // gamma
gl_FragColor = vec4(col, 1.0);
```

---

## FASE 3 — ESTRUCTURA COMPLETA DEL ARCHIVO HTML

El agente DEBE generar exactamente esta estructura. Sin excepciones:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[NOMBRE DEL EFECTO]</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050508; overflow: hidden; }
    
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
    
    /* Panel de controles — esquina inferior izquierda */
    #controls {
      position: fixed;
      bottom: 24px;
      left: 24px;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px 20px;
      color: rgba(255,255,255,0.7);
      font-family: -apple-system, sans-serif;
      font-size: 12px;
      min-width: 200px;
      z-index: 10;
    }
    
    #controls h3 {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 12px;
    }
    
    .control-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .control-row label {
      width: 80px;
      font-size: 11px;
    }
    
    .control-row input[type="range"] {
      flex: 1;
      accent-color: rgba(255,255,255,0.6);
      cursor: pointer;
    }
    
    .control-row span {
      width: 32px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      font-family: monospace;
      font-size: 11px;
    }
    
    /* Badge de FPS — esquina superior derecha */
    #fps-badge {
      position: fixed;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      padding: 4px 10px;
      color: rgba(255,255,255,0.5);
      font-family: monospace;
      font-size: 11px;
      z-index: 10;
    }
    
    /* Etiqueta del preset activo */
    #preset-label {
      position: fixed;
      top: 16px;
      left: 24px;
      color: rgba(255,255,255,0.3);
      font-family: -apple-system, sans-serif;
      font-size: 11px;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>

<canvas id="canvas"></canvas>
<div id="fps-badge">-- fps</div>
<div id="preset-label">[NOMBRE DEL PRESET]</div>

<div id="controls">
  <h3>Parámetros</h3>
  <div class="control-row">
    <label>Velocidad</label>
    <input type="range" id="speed" min="0.1" max="3" step="0.1" value="1">
    <span id="speed-val">1.0</span>
  </div>
  <div class="control-row">
    <label>Escala</label>
    <input type="range" id="scale" min="0.5" max="4" step="0.1" value="1.5">
    <span id="scale-val">1.5</span>
  </div>
  <div class="control-row">
    <label>Distorsión</label>
    <input type="range" id="warp" min="0" max="2" step="0.05" value="0.6">
    <span id="warp-val">0.60</span>
  </div>
  <!-- AGENTE: Agrega controles adicionales según los uniforms del shader -->
</div>

<script>
// ============================================================
// SETUP WEBGL
// ============================================================
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl', {
  antialias: false,        // OFF — el shader ya hace AA implícito
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false
});

if (!gl) {
  document.body.innerHTML = '<p style="color:white;padding:20px">WebGL no disponible en este navegador.</p>';
  throw new Error('WebGL not supported');
}

// ============================================================
// VERTEX SHADER — trivial, solo un quad fullscreen
// ============================================================
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// ============================================================
// FRAGMENT SHADER — AQUÍ EL AGENTE PONE EL EFECTO
// REGLAS:
//   - precision highp float; SIEMPRE
//   - Uniforms obligatorios: u_time, u_res, u_mouse
//   - Uniforms opcionales: u_speed, u_scale, u_warp, u_colorN
//   - INCLUIR Simplex Noise completo (Bloque A)
//   - INCLUIR fBm (Bloque B)
//   - INCLUIR Domain Warping (Bloque C) si el efecto lo usa
//   - INCLUIR Metaballs (Bloque D) si el efecto lo usa
//   - SIEMPRE terminar con vignette + gamma
// ============================================================
const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_speed;
uniform float u_scale;
uniform float u_warp;

// ── Colores del tema (ajustar por preset) ──
uniform vec3 u_color1;  // color caliente / primario
uniform vec3 u_color2;  // color frío / secundario
uniform vec3 u_color3;  // color de acento
uniform vec3 u_bg;      // color de fondo (oscuro)

// ────────────────────────────────────────────
// BLOQUE A: Simplex Noise 3D (PEGAR COMPLETO)
// ────────────────────────────────────────────
// [AGENTE: pega aquí el Bloque A completo]

// ────────────────────────────────────────────
// BLOQUE B: fBm multioctava
// ────────────────────────────────────────────
// [AGENTE: pega aquí el Bloque B]

// ────────────────────────────────────────────
// MAIN — lógica del efecto
// ────────────────────────────────────────────
void main() {
  // 1. Coordenadas UV centradas, aspect-ratio correcto
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  
  float t = u_time * u_speed * 0.3;
  vec2 mouse = u_mouse - 0.5; // centrar mouse en -0.5..0.5

  // 2. Domain warping
  vec2 q = vec2(
    fbm(vec3(uv * u_scale + vec2(0.0, t * 0.7), t * 0.3)),
    fbm(vec3(uv * u_scale + vec2(5.2, 1.3) + vec2(0.0, t * 0.5), t * 0.25))
  );
  vec2 warped = uv + u_warp * q;

  // 3. Evaluar noise sobre coordenadas warpeadas
  float n1 = fbm(vec3(warped * u_scale * 1.2 + vec2(t * 0.4, t * 0.3), t * 0.2));
  float n2 = fbm(vec3(warped * u_scale * 0.8 + vec2(-t * 0.3, t * 0.5), t * 0.15));
  float n3 = snoise(vec3(warped * u_scale * 2.0 + vec2(t * 0.6, -t * 0.4), t * 0.35));

  // 4. Convertir noise (-1..1) a rango (0..1)
  float a = n1 * 0.5 + 0.5;
  float b = n2 * 0.5 + 0.5;
  float c = n3 * 0.5 + 0.5;

  // 5. Composición de color
  vec3 col = u_bg;
  col = mix(col, u_color3, a * 0.8);
  col = mix(col, u_color1, b * a * 0.9);
  col = mix(col, u_color2, c * b * 0.7);

  // 6. Influencia del mouse (opcional — suaviza la zona del cursor)
  float mouseDist = 1.0 - smoothstep(0.0, 0.3, length(uv - mouse));
  col = mix(col, col * 1.3, mouseDist * 0.2);

  // 7. Vignette
  float vig = 1.0 - length(uv) * 0.6;
  col *= clamp(vig, 0.0, 1.0);

  // 8. Gamma correction (ACES-like)
  col = pow(clamp(col, 0.0, 1.0), vec3(0.9));

  gl_FragColor = vec4(col, 1.0);
}
`;

// ============================================================
// COMPILACIÓN Y LINKING
// ============================================================
function createShader(type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    console.error('Source:\n', src.split('\n').map((l,i) => `${i+1}: ${l}`).join('\n'));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, VERT));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, FRAG));
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error('Program link error:', gl.getProgramInfoLog(program));
}
gl.useProgram(program);

// ============================================================
// GEOMETRÍA — quad fullscreen (2 triángulos)
// ============================================================
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1,   1, -1,   -1, 1,   1, 1  // TRIANGLE_STRIP
]), gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, 'a_pos');
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

// ============================================================
// UNIFORMS — cachear locations
// ============================================================
const U = {};
const uniformNames = [
  'u_time', 'u_res', 'u_mouse',
  'u_speed', 'u_scale', 'u_warp',
  'u_color1', 'u_color2', 'u_color3', 'u_bg'
  // AGENTE: agrega aquí los uniforms adicionales de tu shader
];
uniformNames.forEach(name => {
  U[name] = gl.getUniformLocation(program, name);
});

// ============================================================
// PRESETS DE COLORES
// AGENTE: define aquí todos los presets del efecto
// ============================================================
const PRESETS = {
  anthropic: {
    color1: [0.55, 0.35, 0.85],  // purple
    color2: [0.85, 0.45, 0.55],  // rose
    color3: [0.25, 0.25, 0.45],  // dark blue
    bg:     [0.05, 0.04, 0.09]   // near-black
  },
  openai: {
    color1: [0.40, 0.70, 0.90],
    color2: [0.70, 0.85, 1.00],
    color3: [0.15, 0.30, 0.50],
    bg:     [0.02, 0.03, 0.05]
  },
  aurora: {
    color1: [0.20, 0.90, 0.70],
    color2: [0.10, 0.50, 0.90],
    color3: [0.60, 0.20, 0.80],
    bg:     [0.01, 0.02, 0.04]
  }
  // AGENTE: agrega más presets según el brief
};

let currentPreset = PRESETS.anthropic;

// ============================================================
// ESTADO DE INTERACCIÓN
// ============================================================
let mouseX = 0.5, mouseY = 0.5;
let startTime = performance.now();
let frameCount = 0, lastFPSTime = performance.now();

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / canvas.offsetWidth;
  mouseY = 1.0 - (e.clientY / canvas.offsetHeight); // WebGL Y-up
});

// Touch support
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  mouseX = touch.clientX / canvas.offsetWidth;
  mouseY = 1.0 - (touch.clientY / canvas.offsetHeight);
}, { passive: false });

// ============================================================
// RESIZE HANDLER — canvas siempre en resolución nativa
// ============================================================
function resize() {
  const dpr = Math.min(window.devicePixelRatio, 2); // cap a 2x para performance
  canvas.width  = Math.floor(window.innerWidth  * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();

// ============================================================
// CONTROLES UI — bind sliders
// ============================================================
const controls = {
  speed: { el: document.getElementById('speed'), valEl: document.getElementById('speed-val'), decimals: 1 },
  scale: { el: document.getElementById('scale'), valEl: document.getElementById('scale-val'), decimals: 1 },
  warp:  { el: document.getElementById('warp'),  valEl: document.getElementById('warp-val'),  decimals: 2 },
};

Object.entries(controls).forEach(([key, ctrl]) => {
  ctrl.el.addEventListener('input', () => {
    ctrl.valEl.textContent = parseFloat(ctrl.el.value).toFixed(ctrl.decimals);
  });
});

// ============================================================
// RENDER LOOP — requestAnimationFrame
// ============================================================
function render() {
  const now = performance.now();
  const t = (now - startTime) * 0.001; // segundos

  // Leer controles
  const speed = parseFloat(controls.speed.el.value);
  const scale = parseFloat(controls.scale.el.value);
  const warp  = parseFloat(controls.warp.el.value);

  // Upload uniforms
  gl.uniform1f(U.u_time,   t);
  gl.uniform2f(U.u_res,    canvas.width, canvas.height);
  gl.uniform2f(U.u_mouse,  mouseX, mouseY);
  gl.uniform1f(U.u_speed,  speed);
  gl.uniform1f(U.u_scale,  scale);
  gl.uniform1f(U.u_warp,   warp);
  gl.uniform3fv(U.u_color1, currentPreset.color1);
  gl.uniform3fv(U.u_color2, currentPreset.color2);
  gl.uniform3fv(U.u_color3, currentPreset.color3);
  gl.uniform3fv(U.u_bg,     currentPreset.bg);

  // Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // FPS counter
  frameCount++;
  if (now - lastFPSTime > 500) {
    const fps = Math.round(frameCount * 1000 / (now - lastFPSTime));
    document.getElementById('fps-badge').textContent = fps + ' fps';
    frameCount = 0;
    lastFPSTime = now;
  }

  requestAnimationFrame(render);
}

render();
</script>

</body>
</html>
```

---

## FASE 4 — REGLAS CRÍTICAS PARA EL AGENTE

### ✅ SIEMPRE hacer:
- Incluir el Bloque A (Simplex Noise) COMPLETO — nunca resumirlo
- Coordenadas UV centradas: `(gl_FragCoord.xy - 0.5*u_res) / min(u_res.x, u_res.y)`
- `precision highp float;` al inicio del fragment shader
- Canvas con `devicePixelRatio` (cap a 2x para performance)
- Cachear TODOS los uniform locations ANTES del render loop
- Panel de controles con sliders para los parámetros principales
- Contador de FPS visible
- Mouse tracking normalizado (0.0–1.0, Y invertida)
- `gl.getShaderInfoLog()` en caso de error de compilación

### ❌ NUNCA hacer:
- Llamar `gl.getUniformLocation()` dentro del render loop (muy lento)
- Usar `precision mediump float` — causa banding visible
- Olvidar el aspecto ratio en las coordenadas UV
- Usar `for` loops con variable length en GLSL (no soportado en WebGL 1)
- Crear buffers o shaders dentro del render loop
- Usar `alert()` para errores — usar `console.error()`
- `gl.flush()` o `gl.finish()` dentro del loop (bloquean la GPU)

### ⚡ OPTIMIZACIONES obligatorias:
- 5 octavas de fBm máximo (más = caída de fps notable)
- Domain warping: máximo 2 niveles
- Metaballs: máximo 5 orbes simultáneos
- Ray marching: máximo 64 pasos, distancia máxima 20.0
- `devicePixelRatio` cap en 2.0

---

## FASE 5 — PRESETS PARA USAR COMO REFERENCIA

| Nombre | Técnica principal | Color base | Velocidad | Aplicación |
|--------|------------------|------------|-----------|------------|
| `anthropic` | fBm + domain warp | Purple/Rose | 0.3 | Hero section oscuro |
| `openai` | fBm + metaballs | Blue/White | 0.25 | Fondo minimalista |
| `aurora` | fBm multistep | Teal/Purple/Green | 0.2 | Efecto cinematográfico |
| `lava` | Turbulence + voronoi | Orange/Red | 0.5 | Alta energía |
| `ocean` | fBm + normal map | Cyan/Blue | 0.15 | Calma/trust |
| `nebula` | 3-layer domain warp | Indigo/Violet | 0.1 | Épico/espacial |
| `glass` | SDF + refraction | White/Silver | 0.4 | Minimalismo premium |
| `plasma` | Turbulence alta freq | Cyan/Magenta | 0.8 | Techno/energía |

---

## FASE 6 — PROMPT DE VARIACIÓN (para pedir cambios)

Si quieres variar el efecto ya generado, usa este formato:

```
Modifica el shader anterior para:
- TÉCNICA: cambiar [fBm / domain warp / metaballs / ray march] por [nueva técnica]
- COLORES: de [color actual] a [nuevos colores en RGB 0-1]
- VELOCIDAD: [más lento / más rápido / multiplicar por X]
- ESCALA: [más detalle / más grueso]
- NUEVO UNIFORM: agregar u_[nombre] que controle [parámetro]
- NUEVO CONTROL: slider en el panel para el nuevo uniform
Mantén el resto del pipeline intacto. Muestra la vista previa actualizada.
```

---

## METADATOS DEL PROMPT

- **Versión:** 2026.1
- **Compatibilidad:** WebGL 1.0 (todos los browsers modernos), WebGL 2.0 (mejoras opcionales)
- **Performance target:** 60fps en hardware mid-range (GTX 1060 / Apple M1)
- **Fuentes técnicas:** iquilezles.org, WebGL Fundamentals, Shadertoy community, Khronos WebGPU spec
- **Técnicas cubiertas:** Simplex Noise 3D, fBm multioctava, Domain Warping (Inigo Quilez), Metaballs, Ray Marching, SDF, Smooth-min, Vignette, Gamma correction
- **Agentes validados:** Manus, Claude Code, Cursor, Bolt.new, v0.dev