import React, { useEffect, useRef } from 'react';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: false }) ||
      (canvas.getContext('experimental-webgl', {
        powerPreference: 'high-performance',
        alpha: false,
      }) as WebGLRenderingContext | null);

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

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;

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
uniform vec2 u_click_pos;
uniform float u_click_progress;

// Pseudo-random hash
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    // Aspect-corrected centered coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t = u_time * 0.45; // Calmer, smoother tempo

    // Deep high-tech cyber background: deep dark slate & midnight obsidian
    vec3 col = mix(vec3(0.008, 0.015, 0.03), vec3(0.002, 0.005, 0.01), length(uv) * 0.9);

    // Subtle isometric/tech perspective grid on the floor (softer intensity)
    vec2 gridUv = uv;
    gridUv.y += 0.45;
    float pGrid = 0.35 / (abs(gridUv.y) + 0.12);
    vec2 pCoord = vec2(gridUv.x * pGrid, pGrid + t * 0.25);
    vec2 fGrid = abs(fract(pCoord * 4.0) - 0.5);
    float gridLines = smoothstep(0.47, 0.5, max(fGrid.x, fGrid.y));
    col += vec3(0.015, 0.05, 0.12) * (1.0 - gridLines) * smoothstep(0.0, -0.6, uv.y) * 0.25;

    // -------------------------------------------------------------------
    // 1. DIGITAL MATRIX / TERMINAL CODE STREAM (Subtle, non-distracting)
    // -------------------------------------------------------------------
    float cols = 36.0; // Less dense, more breathing space
    vec2 rainUv = uv * vec2(cols, cols * 0.5);
    float colIndex = floor(rainUv.x);
    float colSpeed = mix(0.7, 1.8, hash1(colIndex * 33.1));
    float rainOffset = t * colSpeed + hash1(colIndex * 71.9) * 20.0;
    
    float charIndex = floor(rainUv.y + rainOffset);
    vec2 charCell = fract(vec2(rainUv.x, rainUv.y + rainOffset)) - 0.5;

    // Procedural pseudo-glyph / binary bits
    float glyphHash = hash(vec2(colIndex, charIndex));
    float glyphShape = step(0.12, abs(charCell.x)) * step(0.15, abs(charCell.y));
    float glyphCross = step(0.35, min(abs(charCell.x), abs(charCell.y)));
    float charMask = (1.0 - glyphCross) * (glyphHash > 0.4 ? 1.0 : 0.0);

    // Rain drop head glow & fading tail
    float dropProgress = fract((rainUv.y + rainOffset) * 0.08);
    float tail = pow(1.0 - dropProgress, 4.0);
    float head = smoothstep(0.96, 1.0, 1.0 - dropProgress) * 2.0;

    // Ambient palette: subdued cyan & muted emerald
    vec3 matrixGreen = vec3(0.03, 0.75, 0.40);
    vec3 matrixCyan = vec3(0.0, 0.65, 0.85);
    vec3 charCol = mix(matrixGreen, matrixCyan, sin(colIndex * 0.2 + t) * 0.5 + 0.5);

    // Reduced brightness multiplier from 0.38 to 0.15 for atmospheric balance
    col += charCol * charMask * (tail * 0.22 + head * 0.55) * 0.15;

    // -------------------------------------------------------------------
    // 2. CYBER CIRCUIT BUSES & DATA PACKETS (Delicate architectural lines)
    // -------------------------------------------------------------------
    vec2 circuitUv = uv * 5.5;
    vec2 cId = floor(circuitUv);
    vec2 cF = fract(circuitUv) - 0.5;
    
    float circuitH = abs(cF.y) - 0.012;
    float circuitV = abs(cF.x) - 0.012;
    float circuitDiag = abs(abs(cF.x) - abs(cF.y)) - 0.016;
    float circuitTrace = min(min(circuitH, circuitV), circuitDiag);
    float traceLine = smoothstep(0.02, 0.004, circuitTrace);
    
    float nodeDot = smoothstep(0.1, 0.03, length(cF));
    float activeNode = step(0.75, hash(cId));

    col += vec3(0.02, 0.15, 0.32) * traceLine * 0.07;
    col += vec3(0.0, 0.50, 0.80) * nodeDot * activeNode * 0.12;

    // Gentle light packets
    float packetPhase = fract(t * 1.0 + hash(cId) * 5.0);
    vec2 packetPos = vec2(packetPhase - 0.5, 0.0);
    float packet = smoothstep(0.07, 0.0, length(cF - packetPos)) * activeNode;
    col += vec3(0.2, 0.8, 0.95) * packet * 0.25;

    // -------------------------------------------------------------------
    // 3. FLOATING NEON PARTICLES (Reduced count and glow)
    // -------------------------------------------------------------------
    for (int i = 0; i < 9; i++) {
        float fi = float(i);
        float pSpeed = mix(0.1, 0.25, hash1(fi * 12.3));
        vec2 pPos = vec2(
            sin(t * pSpeed + fi * 1.6) * 0.8,
            cos(t * (pSpeed * 0.8) + fi * 2.1) * 0.55
        );
        float pDist = length(uv - pPos);
        float pGlow = 0.004 / (pDist + 0.015);
        
        vec3 pColor = mix(vec3(0.0, 0.70, 0.9), vec3(0.5, 0.15, 0.8), sin(fi + t) * 0.5 + 0.5);
        col += pColor * pGlow * 0.09;
    }

    // -------------------------------------------------------------------
    // 4. CLICK-ONLY SHOCKWAVE / EXPANDING PULSE (Solo al hacer clic)
    // -------------------------------------------------------------------
    if (u_click_progress < 1.0) {
        float clickDist = length(uv - u_click_pos);
        float waveRadius = u_click_progress * 1.1;
        float ringWidth = 0.035;
        float waveRing = smoothstep(ringWidth, 0.0, abs(clickDist - waveRadius));
        float waveFade = (1.0 - u_click_progress) * (1.0 - u_click_progress);
        
        // High-tech electric cyan wave that expands and dissolves
        vec3 waveColor = mix(vec3(0.0, 0.9, 1.0), vec3(0.1, 0.95, 0.5), u_click_progress);
        col += waveColor * waveRing * waveFade * 0.8;

        // Subtle initial focal spark at click point
        float centerSpark = smoothstep(0.12, 0.0, clickDist) * smoothstep(0.25, 0.0, u_click_progress);
        col += vec3(0.2, 0.85, 1.0) * centerSpark * 0.45;
    }

    // -------------------------------------------------------------------
    // 5. SCANLINE & CENTER VIGNETTE (Keeps reading area dark & clear)
    // -------------------------------------------------------------------
    float scanline = sin(gl_FragCoord.y * 1.8) * 0.025;
    col -= scanline;

    // Deeper vignette so the center/text is ultra legible
    float vignette = smoothstep(1.3, 0.35, length(uv));
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
    const uClickPos = gl.getUniformLocation(prog, 'u_click_pos');
    const uClickProgress = gl.getUniformLocation(prog, 'u_click_progress');

    // Click tracking state
    const clickPos = { x: 0.0, y: 0.0 };
    let clickStartTime = -999.0;
    const CLICK_DURATION = 0.85; // 850ms duration for expansion and fade

    const handlePointerDown = (event: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const minDim = Math.min(rect.width, rect.height);
        const px = event.clientX - rect.left;
        const py = rect.height - (event.clientY - rect.top); // WebGL Y is inverted
        clickPos.x = (px - 0.5 * rect.width) / minDim;
        clickPos.y = (py - 0.5 * rect.height) / minDim;
        clickStartTime = performance.now() * 0.001;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    let isRunning = true;
    function render(t: number) {
      if (!isRunning || !gl || !canvas) return;
      if (!resizeObserver) syncSize();

      gl.viewport(0, 0, canvas.width, canvas.height);
      const currentTime = t * 0.001;

      if (uTime) gl.uniform1f(uTime, currentTime);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

      let progress = 1.0;
      if (clickStartTime > 0) {
        const elapsed = currentTime - clickStartTime;
        progress = Math.min(Math.max(elapsed / CLICK_DURATION, 0.0), 1.0);
      }

      if (uClickPos) gl.uniform2f(uClickPos, clickPos.x, clickPos.y);
      if (uClickProgress) gl.uniform1f(uClickProgress, progress);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointerdown', handlePointerDown);
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
        className="w-full h-full block opacity-75 transition-opacity duration-1000"
      />
    </div>
  );
};
