<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let animationId = 0;

	// Programs
	let progUpdate: WebGLProgram | null = null;
	let progDisplay: WebGLProgram | null = null;

	// Geometry buffers
	let quadBuffer: WebGLBuffer | null = null;

	// FBO ping-pong
	type RT = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };
	let rtA: RT | null = null;
	let rtB: RT | null = null;

	// Uniform/attrib locations
	let locUpdate: { a_pos: number; u_prev: WebGLUniformLocation | null; u_resolution: WebGLUniformLocation | null; u_time: WebGLUniformLocation | null; u_frame: WebGLUniformLocation | null } | null = null;
	let locDisplay: { a_pos: number; u_tex: WebGLUniformLocation | null; u_resolution: WebGLUniformLocation | null } | null = null;

	// --- Shaders (inspired by snippet) ---
	const VS_QUAD = `
		attribute vec2 a_pos;
		void main(){
			gl_Position = vec4(a_pos, 0.0, 1.0);
		}
	`;

	// Update step: seed on first frame; otherwise fade previous and move heads stochastically from neighbors
	const FS_UPDATE = `
		precision mediump float;
		uniform sampler2D u_prev;      // iChannel0
		uniform vec2 u_resolution;     // iResolution.xy
		uniform float u_time;          // iTime
		uniform int u_frame;           // iFrame

		// random helpers matching the style of the provided snippet
		vec2 rnd2(vec2 x){
			vec2 s = sin((x + u_time) * mat2(1.0, 13.51, 73.37, -57.17));
			return fract(30000.0 * s);
		}
		vec2 srnd(vec2 x){
			return sign(2.0 * rnd2(x) - 1.0);
		}

		vec4 texAt(vec2 U, vec2 d){
			vec2 R = u_resolution;
			vec2 uv = fract((U + d) / R);
			return texture2D(u_prev, uv);
		}

		void main(){
			vec2 R = u_resolution;
			vec2 U = gl_FragCoord.xy; // pixel space

			// Seed
			if(u_frame == 0){
				float s = rnd2(U).x < 2e-30 ? 1.0 : 0.0; // sparser seeds
				// Seed heads in hot pink #ff05ba
				gl_FragColor = vec4(vec3(1.0, 0.019607843, 0.729411765) * s, 1.0);
				return;
			}

			// Old track fade out
			vec4 cur = texAt(U, vec2(0.0));
			vec4 O = cur * (1.0 - vec4(1.0, 2.0, 3.0, 0.0) * 5e-3);

			// Look at neighbors; if neighbor is head and decides to step here
			for(int j = -1; j <= 1; j++){
				for(int i = -1; i <= 1; i++){
					vec2 d = vec2(float(i), float(j));
					vec4 nb = texAt(U, d);
					// neighbor is head?
					if(nb.x > 0.999){
						// stochastic direction: does neighbor choose to move to -d (i.e., this pixel)?
						vec2 s = srnd(U + d);
						// require exact match to -d on both components (with tolerance)
						if(all(lessThan(abs(s + d), vec2(0.01)))){
							O = nb; // move head here (carry its color/track)
						}
					}
				}
			}

			gl_FragColor = O;
		}
	`;

	// Display: just show the state texture
	const FS_DISPLAY = `
		precision mediump float;
		uniform sampler2D u_tex;       // iChannel0
		uniform vec2 u_resolution;     // iResolution.xy
		void main(){
			vec2 U = gl_FragCoord.xy;
			vec4 c = texture2D(u_tex, U / u_resolution);
			// subtle base color to avoid full black
			c.rgb += vec3(0.01, 0.01, 0.02);
			gl_FragColor = c;
		}
	`;

	function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
		const sh = gl.createShader(type);
		if (!sh) throw new Error('createShader failed');
		gl.shaderSource(sh, source);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(sh) || 'Unknown shader compile error';
			gl.deleteShader(sh);
			throw new Error(info);
		}
		return sh;
	}

	function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
		const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
		const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
		const pr = gl.createProgram();
		if (!pr) throw new Error('createProgram failed');
		gl.attachShader(pr, vs);
		gl.attachShader(pr, fs);
		gl.linkProgram(pr);
		if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(pr) || 'Unknown program link error';
			gl.deleteProgram(pr);
			throw new Error(info);
		}
		return pr;
	}

	function createTextureRT(width: number, height: number): RT {
		if (!gl) throw new Error('GL not ready');
		const tex = gl.createTexture();
		const fbo = gl.createFramebuffer();
		if (!tex || !fbo) throw new Error('Failed to create RT');
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status !== gl.FRAMEBUFFER_COMPLETE) {
			throw new Error('Incomplete framebuffer: ' + status);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return { fbo, tex, w: width, h: height };
	}

	function initGL(): boolean {
		gl = (canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
		if (!gl) {
			console.error('WebGL not supported');
			return false;
		}

		// Programs
		try {
			progUpdate = createProgram(gl, VS_QUAD, FS_UPDATE);
			progDisplay = createProgram(gl, VS_QUAD, FS_DISPLAY);
		} catch (e) {
			console.error(e);
			return false;
		}

		// Quad buffer
		quadBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([ -1, -1, 1, -1, -1, 1, 1, 1 ]),
			gl.STATIC_DRAW
		);

		// Locations
		if (progUpdate) {
			locUpdate = {
				a_pos: gl.getAttribLocation(progUpdate, 'a_pos'),
				u_prev: gl.getUniformLocation(progUpdate, 'u_prev'),
				u_resolution: gl.getUniformLocation(progUpdate, 'u_resolution'),
				u_time: gl.getUniformLocation(progUpdate, 'u_time'),
				u_frame: gl.getUniformLocation(progUpdate, 'u_frame')
			};
		}
		if (progDisplay) {
			locDisplay = {
				a_pos: gl.getAttribLocation(progDisplay, 'a_pos'),
				u_tex: gl.getUniformLocation(progDisplay, 'u_tex'),
				u_resolution: gl.getUniformLocation(progDisplay, 'u_resolution')
			};
		}

		gl.disable(gl.DEPTH_TEST);

		return true;
	}

	function allocRenderTargets() {
		if (!gl) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
		const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);

		// dispose old
		const destroy = (rt: RT | null) => {
			if (!rt || !gl) return;
			gl.deleteFramebuffer(rt.fbo);
			gl.deleteTexture(rt.tex);
		};
		destroy(rtA); destroy(rtB);

		rtA = createTextureRT(w, h);
		rtB = createTextureRT(w, h);

		// clear both
		gl.bindFramebuffer(gl.FRAMEBUFFER, rtA.fbo);
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindFramebuffer(gl.FRAMEBUFFER, rtB.fbo);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	function bindQuad(program: WebGLProgram, attribLoc: number) {
		if (!gl || !quadBuffer) return;
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.enableVertexAttribArray(attribLoc);
		gl.vertexAttribPointer(attribLoc, 2, gl.FLOAT, false, 0, 0);
	}

	function passUpdate(src: RT, dst: RT, time: number, frame: number) {
		if (!gl || !progUpdate || !locUpdate) return;
		gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
		gl.viewport(0, 0, dst.w, dst.h);
		bindQuad(progUpdate, locUpdate.a_pos);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src.tex);
		gl.uniform1i(locUpdate.u_prev, 0);
		gl.uniform2f(locUpdate.u_resolution, dst.w, dst.h);
		gl.uniform1f(locUpdate.u_time, time);
		gl.uniform1i(locUpdate.u_frame, frame);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	function passDisplay(src: RT) {
		if (!gl || !progDisplay || !locDisplay) return;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, canvas.width, canvas.height);
		bindQuad(progDisplay, locDisplay.a_pos);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src.tex);
		gl.uniform1i(locDisplay.u_tex, 0);
		gl.uniform2f(locDisplay.u_resolution, src.w, src.h);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	function resize() {
		if (!gl) return;
		// Ensure CSS size is set by stylesheet; use clientWidth/Height for DPR backing size
		allocRenderTargets();
		// Restart simulation on resize by resetting the frame counter
		frameCount = 0;
	}

	let lastTime = 0;
	let frameCount = 0;
	function frame(nowMS: number) {
		if (!gl || !rtA || !rtB) return;
		const now = nowMS * 0.001;
		const dt = Math.min(0.05, Math.max(0.0, now - lastTime || 0.016));
		lastTime = now;

		// Update state A -> B, then display B, swap
		passUpdate(rtA, rtB, now, frameCount);
		passDisplay(rtB);
		frameCount++;
		// swap
		const tmp = rtA; rtA = rtB; rtB = tmp;

		animationId = requestAnimationFrame(frame);
	}

	onMount(() => {
		if (!initGL()) return;
		// If CSS hasn't sized the canvas yet, set fallback size
		if (!canvas.clientWidth || !canvas.clientHeight) {
			canvas.style.width = '100vw';
			canvas.style.height = '100vh';
		}
		resize();
		window.addEventListener('resize', resize);
		animationId = requestAnimationFrame(frame);

		return () => {
			if (animationId) cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
			// cleanup GL objects
			if (gl) {
				if (rtA) { gl.deleteFramebuffer(rtA.fbo); gl.deleteTexture(rtA.tex); }
				if (rtB) { gl.deleteFramebuffer(rtB.fbo); gl.deleteTexture(rtB.tex); }
				if (quadBuffer) gl.deleteBuffer(quadBuffer);
				if (progUpdate) gl.deleteProgram(progUpdate);
				if (progDisplay) gl.deleteProgram(progDisplay);
			}
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 w-full h-full -z-10 pointer-events-none scale-300"
></canvas>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -10;
		pointer-events: none;
		image-rendering: optimizeQuality;
	}
</style>