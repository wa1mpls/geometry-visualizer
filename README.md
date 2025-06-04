# 🧮 Computer Graphics Labs – 21127690

This repository contains a series of **interactive web-based labs** built using **HTML, CSS, JavaScript**, and **WebGL** for the *Computer Graphics* course. These labs demonstrate foundational algorithms for 2D shape drawing, curve generation, and coordinate systems.

---

## 📚 Lab Overview

### 🔹 Lab 1 – WebGL Overview (Report Only)

- Discusses fundamental WebGL concepts:
  - `gl.createShader`, `gl.bufferData`, `gl.vertexAttribPointer`, `gl.viewport`
  - RGBA color format and depth testing (`gl.DEPTH_TEST`)
  - Error handling and shader pipeline analysis
- Delivered as a written report only (`DHMT_TH_01_21127690.pdf`)

---

### 🔹 Lab 2 – Basic Drawing with Canvas

- Uses HTML5 `<canvas>` and 2D context
- Features:
  - Grid-based coordinate system
  - Midpoint Line Algorithm
  - Midpoint Ellipse Algorithm
  - Parabola drawing (`x = y² / 4p`)
  - Hyperbola drawing (canonical form)
  - Zoom in/out with UI buttons
  - Mouse click to mark points

---

### 🔹 Lab 3 – WebGL Curve Drawing

- Uses WebGL to draw:
  - **Bezier curves** (De Casteljau's algorithm)
  - **Cubic spline curves**
- User specifies number of control points
- Interactive canvas: click to add control points
- Manual shader setup using GLSL
- GPU-accelerated rendering via `gl.drawArrays`

---

### 🔹 Lab 4 – Unified Drawing System

- Combines features from Lab 2 & 3
- Draws:
  - Line, Ellipse, Parabola, Hyperbola
  - Bezier Curve
  - Spline Curve
- Single canvas UI with shape selector
- Supports zoom and point-based drawing
- Clean modular structure using JavaScript functions

---

## ▶️ How to Run

1. Clone or download this repository.
2. Open the `index.html` file inside any `lab X/` folder in your browser.
3. For WebGL (lab 3), ensure your browser supports WebGL.

```bash
# Example
cd "lab 4"
start index.html
```

---

## 📁 Folder Structure

```
lab-zip/
├── lab 1/       # PDF Report
├── lab 2/       # Canvas 2D - Line, Ellipse, Parabola, Hyperbola
├── lab 3/       # WebGL - Bezier & Spline Curves
├── lab 4/       # Integrated Drawing Tool (Canvas + Curve options)
```

---

## 🛠 Technologies Used

- HTML5 Canvas
- JavaScript (Vanilla)
- WebGL
- GLSL shaders
- DOM interaction, mouse/keyboard events

---

## 📌 Notes

These labs were developed as part of the Computer Graphics coursework. No external libraries were used; all rendering logic and algorithms are implemented manually.

---

## 📫 Contact

GitHub: [wa1mpls](https://github.com/wa1mpls)
