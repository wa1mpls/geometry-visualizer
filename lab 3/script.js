const canvas = document.getElementById("webglCanvas")
canvas.width = 800
canvas.height = 600
const gl = canvas.getContext("webgl")

// Initialize shaders
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program.")
    return null
  }
  return shaderProgram
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader: " + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

// Shader sources
const vsSource = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        gl_PointSize = 5.0;
    }
`

const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color
    }
`

const program = initShaderProgram(gl, vsSource, fsSource)
const aPosition = gl.getAttribLocation(program, "aPosition")

// State variables
let controlPoints = []
let curveType = null
let requiredPoints = 0

// Clear screen
gl.clearColor(1.0, 1.0, 1.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

// Event listeners for buttons
document.getElementById("bezierButton").addEventListener("click", () => {
  resetDrawing()
  curveType = "Bezier"
  let validInput = false

  // Nhập số điểm điều khiển cho Bezier (chỉ chấp nhận 3 hoặc 4 điểm)
  while (!validInput) {
    requiredPoints = parseInt(prompt("Enter number of control points (3 or 4):"), 10)
    
    if (requiredPoints === 3 || requiredPoints === 4) {
      validInput = true
      alert("Click on the canvas to add control points.")
    } else {
      alert("Invalid number of control points. Please enter 3 or 4 points.")
    }
  }
})

document.getElementById("splineButton").addEventListener("click", () => {
  resetDrawing()
  curveType = "Spline"
  requiredPoints = parseInt(
    prompt("Enter number of control points (at least 3):"),
    10,
  )
  if (requiredPoints < 3) {
    alert("Invalid number of control points.")
    return
  }
  alert("Click on the canvas to add control points.")
})

// Reset drawing
function resetDrawing() {
  controlPoints = []
  gl.clear(gl.COLOR_BUFFER_BIT)
}

// Handle mouse clicks
canvas.addEventListener("click", (e) => {
  if (controlPoints.length >= requiredPoints) return

  const rect = canvas.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / canvas.width) * 2 - 1
  const y = 1 - ((e.clientY - rect.top) / canvas.height) * 2
  controlPoints.push([x, y])

  drawScene()

  if (controlPoints.length === requiredPoints) {
    if (curveType === "Bezier") {
      drawBezierCurve(controlPoints)
    } else if (curveType === "Spline") {
      drawSplineCurve(controlPoints)
    }
  }
})


// Draw scene
function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw control points
  for (let i = 0; i < controlPoints.length; i++) {
    drawPoint(controlPoints[i])
  }
}

function drawPoint(point) {
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)
  gl.drawArrays(gl.POINTS, 0, 1)
}

// Bezier curve drawing
function drawBezierCurve(points) {
  if (points.length !== 3 && points.length !== 4) {
    alert("Bezier curve requires 3 or 4 control points.")
    return
  }

  const curvePoints = []
  for (let t = 0; t <= 1; t += 0.02) {
    const point = deCasteljau(points, t)
    curvePoints.push(point)
  }
  drawLines(curvePoints)
}

function deCasteljau(points, t) {
  while (points.length > 1) {
    const newPoints = []
    for (let i = 0; i < points.length - 1; i++) {
      const x = (1 - t) * points[i][0] + t * points[i + 1][0]
      const y = (1 - t) * points[i][1] + t * points[i + 1][1]
      newPoints.push([x, y])
    }
    points = newPoints
  }
  return points[0]
}

function drawLines(points) {
  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(points.flat()),
    gl.STATIC_DRAW,
  )
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)
  gl.drawArrays(gl.LINE_STRIP, 0, points.length)
}
// Spline curve drawing (Cubic Spline)

// Cubic Spline curve drawing
function drawSplineCurve(points) {
  const curvePoints = []

  if (points.length < 3) {
    alert("At least 3 points are required for cubic splines.")
    return
  }

  // Generate curve points using cubic spline interpolation
  const splinePoints = calculateCubicSpline(points)

  for (let t = 0; t < splinePoints.length - 1; t++) {
    const p1 = splinePoints[t]
    const p2 = splinePoints[t + 1]
    curvePoints.push([p1[0], p1[1]])
    curvePoints.push([p2[0], p2[1]])
  }

  drawLines(curvePoints)
}

// Cubic Spline Calculation
function calculateCubicSpline(points) {
  const n = points.length - 1
  const a = points.map(p => p[1]) // y-coordinates

  // Create and solve the tridiagonal matrix for the spline
  const h = []
  for (let i = 0; i < n; i++) {
    h.push(points[i + 1][0] - points[i][0])
  }

  const alpha = [0]
  for (let i = 1; i < n; i++) {
    const term = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1])
    alpha.push(term)
  }

  const l = [1], mu = [0], z = [0]
  for (let i = 1; i < n; i++) {
    l.push(2 * (points[i + 1][0] - points[i - 1][0]) - h[i - 1] * mu[i - 1])
    mu.push(h[i] / l[i])
    z.push((alpha[i] - h[i - 1] * z[i - 1]) / l[i])
  }
  l.push(1)
  z.push(0)

  const c = Array(n + 1).fill(0)
  const b = [], d = []
  for (let j = n - 1; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1]
    b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3
    d[j] = (c[j + 1] - c[j]) / (3 * h[j])
  }

  const splinePoints = []
  for (let i = 0; i < n; i++) {
    const x0 = points[i][0]
    const x1 = points[i + 1][0]
    const y0 = points[i][1]
    for (let x = x0; x <= x1; x += 0.01) {
      const deltaX = x - x0
      const y = a[i] + b[i] * deltaX + c[i] * deltaX ** 2 + d[i] * deltaX ** 3
      splinePoints.push([x, y])
    }
  }

  return splinePoints
}



