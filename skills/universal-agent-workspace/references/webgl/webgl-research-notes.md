Las técnicas principales son:

1. Shader WebGL / Canvas en tiempo real — esos fondos que respiran y se mueven son fragment shaders escritos en GLSL corriendo directamente en la GPU del browser. No son videos ni GIFs.
2. Noise functions (Simplex/Perlin) — el movimiento orgánico y fluido viene de noise multidimensional. La clave es combinar múltiples octavas a diferentes frecuencias y amplitudes.
3. Ray marching — OpenAI usa esto para sus esferas metálicas líquidas. Es un algoritmo de rendering donde "caminas" un rayo por el espacio hasta chocar con una superficie implícita definida matemáticamente.
4. Metaballs + SDF (Signed Distance Fields) — las formas que se fusionan y separan son campos de distancia combinados con smooth-min.
5. Post-processing — chromatic aberration, bloom y vignette agregados via CSS filter o segundo canvas para ese look premium. 
   El stack técnico concreto que usan:
   
   Anthropic.com — Canvas 2D con Simplex Noise + domain warping. El fondo se genera pixel por pixel en un fragment shader GLSL. El truco es el domain warping: usas noise para distorsionar las coordenadas antes de evaluar otro noise — eso crea el efecto de fluido orgánico.
   
   OpenAI.com — La esfera metálica líquida usa ray marching con SDFs. No hay geometría real: cada frame el shader "camina" un rayo matemáticamente hasta que choca con la superficie definida como length(p) - radius. La fusión líquida viene de smooth-min entre múltiples esferas.
   
   Las 3 piezas que hacen la diferencia real:
   
   fBm (fractional Brownian Motion) — sumas múltiples octavas de noise a frecuencias y amplitudes distintas (amplitude *= 0.5, frequency *= 2.1 por capa). Dan esa complejidad multiscalar, ni muy suave ni muy ruidosa.
   Domain warping — usas un fbm para distorsionar las coordenadas UV antes de evaluar el color. Ike Juang popularizó esto. Crea movimiento que parece tener "memoria".
   Post-processing mínimo — vignette (1.0 - length(uv) * 0.6) y gamma correction (pow(color, 0.9)) al final. Eso da la profundidad y el look "premium" sin hacer nada complejo.
   
   Todo corre en la GPU del browser a 60fps con WebGL — ni librerías ni Three.js. Solo un quad con un shader. ahora quiero que agregues esto ala skills asi mismo que tenga esta habilidades no quiero que cambias nada asi mismo tiene que ser y tienes que hacer una prueva de que puede hacer y todo 
   Cada pixel se procesa en paralelo — miles de cores GPU simultáneos
   Una pantalla 1920×1080 = 2,073,600 invocaciones del fragment shader por frame
   Fuente: OpenGL Wiki · Khronos WebGPU spec · iquilezles.org/warp esto tiene que ir junto con la creacion de paginas wed y app que el agente sea capaz  de hacer una wed tambien super realista estilo openai y anthrpic 
   El diagrama de arriba muestra el pipeline real — 2 millones de invocaciones del fragment shader por frame, cada pixel en paralelo. El prompt estructura el trabajo del agente siguiendo ese mismo orden: setup → vertex → rasterización → fragment (con los 7 bloques en secuencia) → post-processing → display.
   
   Las 6 fases que tiene el prompt:
   
   Fase 0 obliga al agente a pensar antes de escribir GLSL. Fase 1 le da el mapa arquitectónico completo. Fase 2 entrega los 6 bloques de código listos para pegar (Simplex Noise completo, fBm, Domain Warping de Inigo Quilez, Metaballs, Ray Marching, Post-processing). Fase 3 es la estructura HTML entera con el render loop correcto. Fase 4 son las reglas críticas — las cosas que hacen que el 90% de los intentos de los agentes fallen (cachear uniform locations, precision highp, aspect ratio correcto). Fase 5 tiene 8 presets listos con colores, técnica y velocidad. Fase 6 es el prompt de variación para pedir cambios.
   
   La regla más importante que los agentes siempre violan:
   
   Nunca llamar gl.getUniformLocation() dentro del render loop. Eso solo debe hacerse una vez al inicio. Si lo haces dentro del loop, a 60fps son 60 llamadas de overhead por segundo solo para obtener referencias que no cambian nunca. El prompt lo marca como crítico en la Fase 4.