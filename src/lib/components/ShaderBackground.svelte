<script lang="ts">
	import { onMount } from 'svelte';
	
	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext;
	let program: WebGLProgram | null = null;
	let animationId: number;
	
	// Vertex shader - defines the quad covering the screen
	const vertexShaderSource = `
		attribute vec4 a_position;
		varying vec2 v_texCoord;
		
		void main() {
			gl_Position = a_position;
			v_texCoord = a_position.xy * 0.5 + 0.5;
		}
	`;
	
	// Fragment shader - creates the visual effect
	const fragmentShaderSource = `
		precision mediump float;
		
		uniform float u_time;
		uniform vec2 u_resolution;
		varying vec2 v_texCoord;
		
		// Renamed uniforms to match Shadertoy convention
		#define iTime u_time
		#define iResolution u_resolution
		
		void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
			// Normalized pixel coordinates (from 0 to 1)
			vec2 uv = fragCoord/iResolution.xy;

			// Time varying pixel color
			vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

			// Output to screen
			fragColor = vec4(col,1.0);
		}
		
		void main() {
			mainImage(gl_FragColor, v_texCoord * u_resolution.xy);
		}
	`;
	
	function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
		const shader = gl.createShader(type);
		if (!shader) return null;
		
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		
		return shader;
	}
	
	function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
		const program = gl.createProgram();
		if (!program) return null;
		
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Error linking program:', gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}
		
		return program;
	}
	
	function setupWebGL() {
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
		if (!gl) {
			console.error('WebGL not supported');
			return false;
		}
		
		// Create shaders
		const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		
		if (!vertexShader || !fragmentShader) {
			return false;
		}
		
		// Create program
		program = createProgram(gl, vertexShader, fragmentShader);
		if (!program) {
			return false;
		}
		
		// Set up geometry (fullscreen quad)
		const positions = new Float32Array([
			-1, -1,
			 1, -1,
			-1,  1,
			 1,  1,
		]);
		
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
		
		const positionLocation = gl.getAttribLocation(program, 'a_position');
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		
		return true;
	}
	
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	
	function render(time: number) {
		if (!program) return;
		
		time *= 0.001; // Convert to seconds
		
		gl.useProgram(program);
		
		// Set uniforms
		const timeLocation = gl.getUniformLocation(program, 'u_time');
		const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
		
		gl.uniform1f(timeLocation, time);
		gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
		
		// Clear and draw
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		animationId = requestAnimationFrame(render);
	}
	
	onMount(() => {
		if (setupWebGL()) {
			resizeCanvas();
			
			window.addEventListener('resize', resizeCanvas);
			animationId = requestAnimationFrame(render);
		}
		
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			window.removeEventListener('resize', resizeCanvas);
		};
	});
</script>

<canvas 
	bind:this={canvas}
	class="fixed inset-0 w-full h-full -z-10 pointer-events-none"
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
	}
</style>