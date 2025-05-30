"use client"

import { useRef, useEffect, useCallback } from "react"

interface ShaderCanvasProps {
  fragmentShader: string
  time: number
  resolution: { width: number; height: number }
  parameters: {
    speed: number
    intensity: number
    scale: number
    colorMultiplier: number
    colorShift: number
    distortion: number
  }
}

export default function ShaderCanvas({ fragmentShader, time, resolution, parameters }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const errorRef = useRef<string | null>(null)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)
  const intensityLocationRef = useRef<WebGLUniformLocation | null>(null)
  const scaleLocationRef = useRef<WebGLUniformLocation | null>(null)
  const colorMultiplierLocationRef = useRef<WebGLUniformLocation | null>(null)
  const colorShiftLocationRef = useRef<WebGLUniformLocation | null>(null)
  const distortionLocationRef = useRef<WebGLUniformLocation | null>(null)

  // Vertex shader is fixed and simple
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `

  // Wrapper for the fragment shader to include uniforms
  const wrapFragmentShader = (fragmentShaderSource: string) => `
    precision highp float;
    
    uniform float iTime;
    uniform vec2 iResolution;
    uniform float iIntensity;
    uniform float iScale;
    uniform float iColorMultiplier;
    uniform float iColorShift;
    uniform float iDistortion;
    
    ${fragmentShaderSource}
    
    void main() {
      vec4 fragColor;
      mainImage(fragColor, gl_FragCoord.xy);
      gl_FragColor = fragColor;
    }
  `

  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) {
      console.error("Failed to create shader")
      return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      errorRef.current = gl.getShaderInfoLog(shader) as string
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram()
    if (!program) {
      console.error("Failed to create program")
      return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    return program
  }

  const initGL = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })

    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    glRef.current = gl

    let program: WebGLProgram | null = null

    try {
      // Create shaders
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
      const wrappedFragmentShader = wrapFragmentShader(fragmentShader)
      const fragShader = createShader(gl, gl.FRAGMENT_SHADER, wrappedFragmentShader)

      if (!vertexShader || !fragShader) {
        return
      }

      // Create program
      program = createProgram(gl, vertexShader, fragShader)
      if (!program) {
        return
      }

      programRef.current = program

      // Get uniform locations
      timeLocationRef.current = gl.getUniformLocation(program, "iTime")
      resolutionLocationRef.current = gl.getUniformLocation(program, "iResolution")
      intensityLocationRef.current = gl.getUniformLocation(program, "iIntensity")
      scaleLocationRef.current = gl.getUniformLocation(program, "iScale")
      colorMultiplierLocationRef.current = gl.getUniformLocation(program, "iColorMultiplier")
      colorShiftLocationRef.current = gl.getUniformLocation(program, "iColorShift")
      distortionLocationRef.current = gl.getUniformLocation(program, "iDistortion")

      // Create a buffer for the position of the rectangle
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

      // Two triangles to form a rectangle covering the entire canvas
      const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

      // Get attribute location
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
      gl.enableVertexAttribArray(positionAttributeLocation)
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

      errorRef.current = null
    } catch (error) {
      console.error("Error initializing WebGL:", error)
      errorRef.current = "Error initializing WebGL"
    }
  }, [fragmentShader])

  const renderGL = useCallback(() => {
    if (!glRef.current || !programRef.current) return

    const gl = glRef.current
    const program = programRef.current

    gl.useProgram(program)

    gl.viewport(0, 0, resolution.width, resolution.height)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Set uniforms
    if (timeLocationRef.current) gl.uniform1f(timeLocationRef.current, time)
    if (resolutionLocationRef.current) gl.uniform2f(resolutionLocationRef.current, resolution.width, resolution.height)
    if (intensityLocationRef.current) gl.uniform1f(intensityLocationRef.current, parameters.intensity)
    if (scaleLocationRef.current) gl.uniform1f(scaleLocationRef.current, parameters.scale)
    if (colorMultiplierLocationRef.current) gl.uniform1f(colorMultiplierLocationRef.current, parameters.colorMultiplier)
    if (colorShiftLocationRef.current) gl.uniform1f(colorShiftLocationRef.current, parameters.colorShift)
    if (distortionLocationRef.current) gl.uniform1f(distortionLocationRef.current, parameters.distortion)

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }, [time, resolution, parameters])

  useEffect(() => {
    initGL()

    return () => {
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current)
      }
    }
  }, [initGL])

  useEffect(() => {
    if (!errorRef.current) {
      renderGL()
    }
  }, [renderGL])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={resolution.width}
        height={resolution.height}
        className="w-full aspect-square bg-black/10 rounded-md"
      />
      {errorRef.current && (
        <div className="absolute inset-0 bg-destructive/80 rounded-md flex items-center justify-center p-4 overflow-auto">
          <div className="text-white text-sm font-mono whitespace-pre-wrap">
            Error en el Shader:
            <br />
            {errorRef.current}
          </div>
        </div>
      )}
    </div>
  )
}
