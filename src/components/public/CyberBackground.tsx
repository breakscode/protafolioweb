import React, { useEffect, useRef } from 'react';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: false }) || 
               canvas.getContext('experimental-webgl', { powerPreference: 'high-performance', alpha: false }) as WebGLRenderingContext | null;
    
    if (!gl) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncSize)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Random hash functions
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    // Aspect-corrected UV space centered
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.85;

    // Mouse interaction vector
    vec2 mouseNorm = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float mouseDist = length(uv - mouseNorm);

    // Deep high-tech cyber background: deep dark slate & midnight obsidian
    vec3 col = mix(vec3(0.01, 0.02, 0.04), vec3(0.003, 0.007, 0.015), length(uv) * 0.8);

    // Subtle isometric/tech perspective grid on the floor
    vec2 gridUv = uv;
    gridUv.y += 0.45;
    float pGrid = 0.35 / (abs(gridUv.y) + 0.12);
    vec2 pCoord = vec2(gridUv.x * pGrid, pGrid + t * 0.4);
    vec2 fGrid = abs(fract(pCoord * 4.0) - 0.5);
    float gridLines = smoothstep(0.46, 0.5, max(fGrid.x, fGrid.y));
    col += vec3(0.02, 0.08, 0.16) * (1.0 - gridLines) * smoothstep(0.0, -0.6, uv.y) * 0.4;

    // -------------------------------------------------------------------
    // 1. DIGITAL MATRIX / TERMINAL CODE STREAM (Cyber Hacker Rain)
    // -------------------------------------------------------------------
    float cols = 48.0;
    vec2 rainUv = uv * vec2(cols, cols * 0.6);
    float colIndex = floor(rainUv.x);
    float colSpeed = mix(1.2, 3.2, hash1(colIndex * 33.1));
    float rainOffset = t * colSpeed + hash1(colIndex * 71.9) * 20.0;
    
    float charIndex = floor(rainUv.y + rainOffset);
    vec2 charCell = fract(vec2(rainUv.x, rainUv.y + rainOffset)) - 0.5;

    // Procedural pseudo-glyph / binary bits
    float glyphHash = hash(vec2(colIndex, charIndex));
    float glyphShape = step(0.12, abs(charCell.x)) * step(0.15, abs(charCell.y));
    float glyphCross = step(0.35, min(abs(charCell.x), abs(charCell.y)));
    float charMask = (1.0 - glyphCross) * (glyphHash > 0.3 ? 1.0 : 0.0);

    // Rain drop head glow & fading tail
    float dropProgress = fract((rainUv.y + rainOffset) * 0.08);
    float tail = pow(1.0 - dropProgress, 3.5);
    float head = smoothstep(0.96, 1.0, 1.0 - dropProgress) * 3.0;

    // Hacker / Cyberpunk phosphor emerald & electric cyan palette
    vec3 matrixGreen = vec3(0.05, 0.95, 0.45);
    vec3 matrixCyan = vec3(0.0, 0.82, 0.98);
    vec3 charCol = mix(matrixGreen, matrixCyan, sin(colIndex * 0.2 + t) * 0.5 + 0.5);

    col += charCol * charMask * (tail * 0.35 + head * 0.85) * 0.38;

    // -------------------------------------------------------------------
    // 2. CYBER CIRCUIT BUSES & DATA PACKETS (Hardware & Architecture)
    // -------------------------------------------------------------------
    vec2 circuitUv = uv * 6.0;
    vec2 cId = floor(circuitUv);
    vec2 cF = fract(circuitUv) - 0.5;
    
    // Diagonal & orthogonal circuit tracks
    float circuitH = abs(cF.y) - 0.015;
    float circuitV = abs(cF.x) - 0.015;
    float circuitDiag = abs(abs(cF.x) - abs(cF.y)) - 0.02;
    float circuitTrace = min(min(circuitH, circuitV), circuitDiag);
    float traceLine = smoothstep(0.025, 0.005, circuitTrace);
    
    // Nodes at intersections
    float nodeDot = smoothstep(0.12, 0.04, length(cF));
    float activeNode = step(0.7, hash(cId));

    col += vec3(0.04, 0.25, 0.45) * traceLine * 0.12;
    col += vec3(0.0, 0.65, 0.95) * nodeDot * activeNode * 0.25;

    // High-speed light packets racing along the tracks
    float packetPhase = fract(t * 1.5 + hash(cId) * 5.0);
    vec2 packetPos = vec2(packetPhase - 0.5, 0.0);
    float packet = smoothstep(0.08, 0.0, length(cF - packetPos)) * activeNode;
    col += vec3(0.3, 0.95, 1.0) * packet * 0.6;

    // -------------------------------------------------------------------
    // 3. FLOATING NEON DATA PARTICLES / CYBERNETIC MESH
    // -------------------------------------------------------------------
    for (int i = 0; i < 18; i++) {
        float fi = float(i);
        float pSpeed = mix(0.15, 0.4, hash1(fi * 12.3));
        vec2 pPos = vec2(
            sin(t * pSpeed + fi * 1.6) * 0.8,
            cos(t * (pSpeed * 0.8) + fi * 2.1) * 0.55
        );
        float pDist = length(uv - pPos);
        float pGlow = 0.006 / (pDist + 0.012);
        
        vec3 pColor = mix(vec3(0.0, 0.85, 1.0), vec3(0.65, 0.2, 0.98), sin(fi + t) * 0.5 + 0.5);
        col += pColor * pGlow * 0.22;
    }

    // -------------------------------------------------------------------
    // 4. MOUSE REACTIVE GRAVITATIONAL PULSE (Interactive Tech Resonance)
    // -------------------------------------------------------------------
    float mouseRing = abs(mouseDist - fract(t * 0.8) * 0.6);
    float shockwave = smoothstep(0.06, 0.0, mouseRing) * smoothstep(0.6, 0.0, mouseDist);
    col += vec3(0.1, 0.7, 1.0) * shockwave * 0.5;

    float mouseAura = 0.035 / (mouseDist + 0.16);
    col += vec3(0.0, 0.85, 0.9) * mouseAura * 0.4;

    // -------------------------------------------------------------------
    // 5. CRT / HUD SCANLINE & EDGE VIGNETTE
    // -------------------------------------------------------------------
    float scanline = sin(gl_FragCoord.y * 1.8) * 0.04;
    col -= scanline;

    float vignette = smoothstep(1.35, 0.45, length(uv));
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
}`;

    function createShader(type: number, source: string) {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isRunning = true;
    function render(t: number) {
      if (!isRunning || !gl || !canvas) return;
      if (!resizeObserver) syncSize();

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      if (gl) {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-1000"
      />
    </div>
  );
};
