// Lấy đối tượng Canvas và ngữ cảnh vẽ
let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
let shapeSelector = document.getElementById("shapeSelector")
let points = [] // Lưu tọa độ chuột

let scale = 1 // Tỷ lệ phóng to/thu nhỏ
let offsetX = canvas.width / 2 // Offset trục X
let offsetY = canvas.height / 2 // Offset trục Y

// Hiển thị tỷ lệ phóng to/thu nhỏ
function setZoom(newScale) {
  scale = newScale
  document.getElementById("zoomValue").textContent = "Tỷ lệ: " + newScale + "x"
  drawGrid() // Vẽ lại lưới sau khi thay đổi tỷ lệ
}

// Hàm vẽ 1 điểm trên Canvas (với màu đen hoặc màu đỏ cho điểm đánh dấu)
function putPixel(x, y, color = "black") {
  ctx.fillStyle = color
  ctx.fillRect((x + offsetX) * scale, (y + offsetY) * scale, 5, 5) // Vẽ điểm với tỷ lệ phóng to
}

// Phóng to/thu nhỏ bằng phím "+" và "-"
document.addEventListener("keydown", function (event) {
  if (event.key === "+" || event.key === "=") {
    setZoom(scale * 1.1) // Phóng to
  } else if (event.key === "-") {
    setZoom(scale / 1.1) // Thu nhỏ
  }
})

// Vẽ hệ tọa độ (trục X, Y)
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height) // Xóa Canvas trước khi vẽ lại
  ctx.beginPath()
  ctx.moveTo(0, offsetY)
  ctx.lineTo(canvas.width, offsetY) // Trục X
  ctx.moveTo(offsetX, 0)
  ctx.lineTo(offsetX, canvas.height) // Trục Y
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 1
  ctx.stroke()

  // Vẽ các vạch chia nhỏ trên trục X, Y
  ctx.beginPath()
  for (let i = offsetX; i < canvas.width; i += 20) {
    ctx.moveTo(i, offsetY - 5)
    ctx.lineTo(i, offsetY + 5)
  }
  for (let i = offsetX; i > 0; i -= 20) {
    ctx.moveTo(i, offsetY - 5)
    ctx.lineTo(i, offsetY + 5)
  }

  for (let i = offsetY; i < canvas.height; i += 20) {
    ctx.moveTo(offsetX - 5, i)
    ctx.lineTo(offsetX + 5, i)
  }
  for (let i = offsetY; i > 0; i -= 20) {
    ctx.moveTo(offsetX - 5, i)
    ctx.lineTo(offsetX + 5, i)
  }

  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 0.5
  ctx.stroke()
}
// Thuật toán vẽ đường thẳng (Mid-point)
function drawLineEffect(x1, y1, x2, y2) {
  let dx = Math.abs(x2 - x1)
  let dy = Math.abs(y2 - y1)
  let sx = x1 < x2 ? 1 : -1
  let sy = y1 < y2 ? 1 : -1
  let err = dx - dy

  let pointsToDraw = []
  while (true) {
    pointsToDraw.push({ x: x1, y: y1 })
    if (x1 === x2 && y1 === y2) break
    let e2 = err * 2
    if (e2 > -dy) {
      err -= dy
      x1 += sx
    }
    if (e2 < dx) {
      err += dx
      y1 += sy
    }
  }

  // Vẽ các điểm dần dần cho đường thẳng
  let i = 0
  let interval = setInterval(function () {
    if (i < pointsToDraw.length) {
      putPixel(pointsToDraw[i].x, pointsToDraw[i].y)
      i++
    } else {
      clearInterval(interval) // Dừng vẽ khi đã hết điểm
    }
  }, 10)
}

// Thuật toán vẽ elip (Midpoint Algorithm)
function drawEllipseEffect(centerX, centerY, A, B) {
  let A2 = A * A,
    B2 = B * B
  let p, Const1, Const2, Delta1, Delta2, x, y, MaxX, MaxY

  MaxX = Math.floor(A2 / Math.sqrt(A2 + B2))
  MaxY = Math.floor(B2 / Math.sqrt(A2 + B2))

  // (0, B) -> (MaxX, MaxY)
  p = B2 - A2 * B + A2 / 4
  Const1 = 2 * B2
  Const2 = 2 * A2
  x = 0
  y = B
  Delta1 = B2 * (2 * x + 3)
  Delta2 = 2 * A2 * (1 - y) + B2 * (2 * x + 3)

  // Vẽ các điểm trong phần đầu của elip (phần 1)
  while (x < MaxX) {
    if (p >= 0) {
      p += Delta2
      Delta2 += Const2
      y--
    } else {
      p += Delta1
      Delta2 += Const1
      Delta1 += Const1
    }
    x++

    // Vẽ các điểm đối xứng qua các trục X và Y
    putPixel(centerX + x, centerY + y, "black") // 1st quadrant
    putPixel(centerX - x, centerY + y, "black") // 2nd quadrant
    putPixel(centerX + x, centerY - y, "black") // 4th quadrant
    putPixel(centerX - x, centerY - y, "black") // 3rd quadrant
  }

  // (A, 0) -> (MaxX, MaxY)
  p = A2 - A * B2 + B2 / 4
  Const1 = 2 * A2
  Const2 = 2 * B2
  x = A
  y = 0
  Delta1 = A2 * (2 * y + 3)
  Delta2 = 2 * B2 * (1 - x) + A2 * (2 * y + 3)

  // Vẽ các điểm trong phần sau của elip (phần 2)
  while (y < MaxY) {
    if (p >= 0) {
      p += Delta2
      Delta2 += Const2
      x--
    } else {
      p += Delta1
      Delta2 += Const1
      Delta1 += Const1
    }
    y++

    // Vẽ các điểm đối xứng qua các trục X và Y
    putPixel(centerX + x, centerY + y, "black") // 1st quadrant
    putPixel(centerX - x, centerY + y, "black") // 2nd quadrant
    putPixel(centerX + x, centerY - y, "black") // 4th quadrant
    putPixel(centerX - x, centerY - y, "black") // 3rd quadrant
  }
}

// Thuật toán vẽ parabol dọc theo trục Y (x = y^2 / (4p))
function drawParabolaEffect(centerX, centerY, p) {
  let pointsToDraw = []

  // Nếu p dương thì parabol mở lên, nếu p âm thì parabol mở xuống
  if (p === 0) return // Trường hợp p = 0 không tạo được parabol

  // Vẽ parabol từ đỉnh (centerX, centerY)
  // Lấy một số lượng các điểm từ y = 0 đến một giá trị yMax
  let yMax = Math.abs(4 * p) // Tính giới hạn y

  // Vẽ parabol từ y = 0 đến yMax
  for (let y = 0; y <= yMax; y++) {
    let x = (y * y) / (4 * p) // Tính x từ phương trình parabol

    // Nếu p dương thì parabol mở lên, nếu p âm thì parabol mở xuống
    if (p > 0) {
      pointsToDraw.push({ x: centerX + x, y: centerY + y }) // Phần trên
      pointsToDraw.push({ x: centerX + x, y: centerY - y }) // Phần trên
    } else {
      pointsToDraw.push({ x: centerX + x, y: centerY - y }) // Phần dưới
      pointsToDraw.push({ x: centerX + x, y: centerY + y }) // Phần dưới
    }
  }

  // Vẽ các điểm của parabol dần dần
  let i = 0
  let interval = setInterval(function () {
    if (i < pointsToDraw.length) {
      putPixel(pointsToDraw[i].x, pointsToDraw[i].y)
      i++
    } else {
      clearInterval(interval) // Dừng vẽ khi đã hết điểm
    }
  }, 10)
}
// Vẽ hyperbol 
function drawHyperbolaEffect(centerX, centerY, a, b) {
  let x = a

  let y = 0

  let a2 = a * a

  let b2 = b * b

  // Điều kiện ban đầu

  let d = 2 * a2 - 2 * a * b2 - b2

  let init = 150 // Giới hạn số bước để Hyperbola không vẽ vô tận

  while (init--) {
    // Vẽ các điểm đối xứng trong bốn phần của Hyperbola

    putPixel(centerX + x, centerY + y, "black") // Góc phần tư 1

    putPixel(centerX - x, centerY + y, "black") // Góc phần tư 2

    putPixel(centerX + x, centerY - y, "black") // Góc phần tư 4

    putPixel(centerX - x, centerY - y, "black") // Góc phần tư 3

    if (d < 0) {
      d += 2 * a2 * (2 * y + 3)
    } else {
      d += 2 * a2 * (2 * y + 3) - 4 * b2 * (x + 1)

      x++
    }

    y++
  }
}

// Xử lý sự kiện chuột để chọn tâm
canvas.addEventListener("mousedown", function (event) {
  let rect = canvas.getBoundingClientRect()
  let x = (event.clientX - rect.left) / scale - offsetX // Điều chỉnh tọa độ theo tỷ lệ
  let y = (event.clientY - rect.top) / scale - offsetY // Điều chỉnh tọa độ theo tỷ lệ

  if (points.length === 0) {
    points.push({ x, y })
    putPixel(x, y, "red") // Vẽ điểm đầu tiên màu đỏ
  } else {
    let selectedShape = shapeSelector.value

    switch (selectedShape) {
      case "line":
        points.push({ x, y })
        drawLineEffect(points[0].x, points[0].y, points[1].x, points[1].y)
        break
      case "ellipse":
        let a = parseInt(prompt("Nhập bán trục dài (a):"))
        let b = parseInt(prompt("Nhập bán trục ngắn (b):"))
        drawEllipseEffect(points[0].x, points[0].y, a, b) // Vẽ elip với tâm là điểm click chuột
        break
      case "parabola":
        let p = parseInt(prompt("Nhập tham số tiêu điểm (p):"))
        drawParabolaEffect(points[0].x, points[0].y, p) // Vẽ parabol
        break
      case "hyperbola":
        let aH = parseInt(prompt("Nhập bán trục thực (a):"))
        let bH = parseInt(prompt("Nhập bán trục ảo (b):"))
        drawHyperbolaEffect(points[0].x, points[0].y, aH, bH) // Vẽ hyperbol
        break
    }
    points = []
  }
})
// Vẽ lại lưới và  và hệ trục
drawGrid()
