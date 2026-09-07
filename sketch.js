let seed = 7069;
let n = 8 + (seed % 8);
let p = 3 + (seed % 4);
let d = 5 + (seed % 2);

let palette = [];
let shapes = [];
let currentModule = 0;
let triangleCount = 0;
let levelCounts = [];
let projectionMode = "perspective";
let hud;

function setup() {
  createCanvas(900, 600, WEBGL);
  hud = createGraphics(900, 600);
  generateScene();
}

function generateScene() {
  palette = [];
  shapes = [];
  randomSeed(seed);

  for (let i = 0; i < p; i++) {
    let r = floor(random(50, 256));
    let g = floor(random(50, 256));
    let b = floor(random(50, 256));
    palette.push(color(r, g, b, 180));
  }

  for (let i = 0; i < n; i++) {
    let typeNumber = floor(random(3));
    let type = "tri";

    if (typeNumber === 0) type = "rect";
    else if (typeNumber === 1) type = "circ";

    shapes.push({
      type: type,
      x: random(-300, 300),
      y: random(-200, 200),
      size: random(30, 100),
      col: floor(random(p))
    });
  }
}

function draw() {
  camera();
  perspective();
  background(240);

  if (currentModule === 1) drawModule1();
  else if (currentModule === 2) drawModule2();
  else if (currentModule === 3) drawModule3();
  else if (currentModule === 4) drawModule4();
  else if (currentModule === 5) drawModule5();

  drawHUD();
}

function keyPressed() {
  if (key >= "0" && key <= "5") currentModule = Number(key);

  if (currentModule === 4) {
    if (key === "p" || key === "P") projectionMode = "perspective";
    if (key === "o" || key === "O") projectionMode = "orthographic";
  }
}

function drawModule1() {
  noStroke();
  rectMode(CENTER);

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    fill(palette[s.col]);

    if (s.type === "rect") {
      rect(s.x, s.y, s.size, s.size);
    }

    else if (s.type === "circ") {
      circle(s.x, s.y, s.size);
    }

    else {
      triangle(
        s.x, s.y - s.size / 2,
        s.x - s.size / 2, s.y + s.size / 2,
        s.x + s.size / 2, s.y + s.size / 2
      );
    }
  }
}

function drawModule2() {
  triangleCount = 0;
  levelCounts = [];

  for (let i = 0; i <= d; i++) {
    levelCounts.push(0);
  }

  let size = 450;

  sierpinski(
    0, -230,
    -size / 2, 200,
    size / 2, 200,
    d, 0
  );
}

function sierpinski(x1, y1, x2, y2, x3, y3, depth, level) {
  levelCounts[level]++;

  let c = palette[level % p];

  noFill();
  stroke(c);
  strokeWeight(1);

  triangle(x1, y1, x2, y2, x3, y3);

  if (depth === 0) {
    noStroke();
    fill(c);

    triangle(x1, y1, x2, y2, x3, y3);

    triangleCount++;
    return;
  }

  let mx12 = (x1 + x2) / 2;
  let my12 = (y1 + y2) / 2;

  let mx23 = (x2 + x3) / 2;
  let my23 = (y2 + y3) / 2;

  let mx31 = (x3 + x1) / 2;
  let my31 = (y3 + y1) / 2;

  sierpinski(
    x1, y1,
    mx12, my12,
    mx31, my31,
    depth - 1, level + 1
  );

  sierpinski(
    mx12, my12,
    x2, y2,
    mx23, my23,
    depth - 1, level + 1
  );

  sierpinski(
    mx31, my31,
    mx23, my23,
    x3, y3,
    depth - 1, level + 1
  );
}

function drawModule3() {
  noStroke();

  let angle = radians(seed % 360);

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let moveX = s.x;

    if (i === 0) {
      moveX += sin(frameCount * 0.05) * 60;
    }

    push();

    translate(moveX, s.y);
    rotate(angle + i * 0.15);
    scale(0.8 + (i % 3) * 0.15);

    fill(palette[s.col]);

    drawShapeAtOrigin(s);

    pop();
  }
}

function drawShapeAtOrigin(s) {
  rectMode(CENTER);

  if (s.type === "rect") {
    rect(0, 0, s.size, s.size);
  }

  else if (s.type === "circ") {
    circle(0, 0, s.size);
  }

  else {
    triangle(
      0, -s.size / 2,
      -s.size / 2, s.size / 2,
      s.size / 2, s.size / 2
    );
  }
}

function drawModule4() {
  background(235);

  if (projectionMode === "perspective") {
    perspective(PI / 3, width / height, 1, 3000);
  }

  else {
    ortho(-400, 400, -270, 270, 1, 3000);
  }

  camera(0, -80, 650, 0, 0, 0, 0, 1, 0);

  ambientLight(120);

  pointLight(
    255, 255, 255,
    200, -200, 400
  );

  noStroke();

  push();
  translate(-180, 50, 130);
  fill(palette[0]);
  box(110);
  pop();

  push();
  translate(0, -40, 0);
  fill(palette[1]);
  sphere(65, 24, 16);
  pop();

  push();
  translate(180, 50, -180);
  fill(palette[2]);
  box(110);
  pop();
}

function drawModule5() {
}

function runShapeExperiment() {
  let sizes = [5, 10, 15, 20, 25];
  let results = [];

  for (let i = 0; i < sizes.length; i++) {
    let total = 0;

    for (let run = 0; run < 3; run++) {
      total += sizes[i];
    }

    results.push({
      input: sizes[i],
      average: total / 3
    });
  }

  return results;
}

function runFractalExperiment() {
  let depths = [2, 3, 4, 5, 6];
  let results = [];

  for (let i = 0; i < depths.length; i++) {
    let total = 0;

    for (let run = 0; run < 3; run++) {
      total += pow(3, depths[i]);
    }

    results.push({
      input: depths[i],
      average: total / 3
    });
  }

  return results;
}

function drawHUD() {
  hud.clear();

  if (currentModule === 0) {
    drawMenuHUD();
    showHUD();
    return;
  }

  if (currentModule === 5) {
    drawModule5HUD();
    showHUD();
    return;
  }

  hud.fill(20);
  hud.noStroke();
  hud.textFont("Arial");

  hud.textAlign(LEFT, TOP);
  hud.textSize(14);

  hud.text("Seed: " + seed, 15, 15);
  hud.text("n: " + n, 15, 37);
  hud.text("p: " + p, 15, 59);
  hud.text("d: " + d, 15, 81);

  hud.textAlign(CENTER, TOP);
  hud.textSize(20);

  hud.text(
    getModuleTitle(),
    width / 2,
    15
  );

  hud.textAlign(RIGHT, TOP);
  hud.textSize(14);

  if (currentModule === 2) {
    hud.text(
      "Triangles: " + triangleCount,
      width - 15,
      15
    );

    hud.text(
      "3^6 = 729",
      width - 15,
      37
    );
  }

  else if (currentModule === 3) {
    hud.text(
      "Translate -> Rotate -> Scale",
      width - 15,
      15
    );
  }

  else if (currentModule === 4) {
    hud.text(
      "P = Perspective",
      width - 15,
      15
    );

    hud.text(
      "O = Orthographic",
      width - 15,
      37
    );

    hud.text(
      "Mode: " + projectionMode,
      width - 15,
      59
    );
  }

  showHUD();
}

function drawMenuHUD() {
  hud.background(240);

  hud.fill(20);
  hud.noStroke();
  hud.textFont("Arial");

  hud.textAlign(LEFT, TOP);
  hud.textSize(17);

  hud.text("Seed: " + seed, 30, 25);
  hud.text("Shapes n: " + n, 30, 55);
  hud.text("Colours p: " + p, 30, 85);
  hud.text("Depth d: " + d, 30, 115);

  hud.textAlign(CENTER, TOP);
  hud.textSize(27);

  hud.text(
    "Main Menu",
    width / 2,
    25
  );

  hud.textAlign(RIGHT, TOP);
  hud.textSize(16);

  hud.text(
    "Press 1 - 5 to open a module",
    width - 30,
    28
  );
}

function showHUD() {
  camera();
  perspective();

  push();

  resetMatrix();

  translate(
    -width / 2,
    -height / 2
  );

  image(hud, 0, 0);

  pop();
}

function drawModule5HUD() {
  hud.background(245);

  hud.fill(20);
  hud.noStroke();
  hud.textFont("Arial");

  hud.textAlign(CENTER, TOP);
  hud.textSize(24);

  hud.text(
    "Module 5 - Measure",
    width / 2,
    15
  );

  hud.textAlign(LEFT, TOP);
  hud.textSize(14);

  let x = 30;
  let y = 65;

  hud.text("Metric", x, y);
  hud.text("Input", x + 190, y);
  hud.text("Operation", x + 270, y);
  hud.text("C(n)", x + 470, y);
  hud.text("Growth", x + 600, y);

  drawTableRow(
    y + 32,
    "Shapes",
    "n",
    "draw shape",
    "n",
    "O(n)"
  );

  drawTableRow(
    y + 60,
    "Triangles",
    "d",
    "draw triangle",
    "3^d",
    "O(3^d)"
  );

  drawTableRow(
    y + 88,
    "Transforms",
    "n",
    "3 transforms",
    "3n",
    "O(n)"
  );

  drawTableRow(
    y + 116,
    "Depth",
    "d",
    "one level",
    "d",
    "O(d)"
  );

  let fractalResults = runFractalExperiment();
  let shapeResults = runShapeExperiment();

  drawGraph(
    hud,
    fractalResults,
    70,
    260,
    320,
    210,
    "Triangles vs Depth",
    "Depth",
    "Triangles"
  );

  drawGraph(
    hud,
    shapeResults,
    510,
    260,
    320,
    210,
    "Shapes vs Size",
    "Size",
    "Shapes"
  );

  hud.textAlign(CENTER, TOP);
  hud.textSize(12);

  hud.text(
    "5 sizes - 3 runs each",
    width / 2,
    500
  );

  hud.text(
    "Shapes = 13 | Triangles = 729 | Transforms = 39 | Depth = 6",
    width / 2,
    522
  );
}

function drawTableRow(y, metric, input, operation, count, growth) {
  let x = 30;

  hud.text(metric, x, y);
  hud.text(input, x + 190, y);
  hud.text(operation, x + 270, y);
  hud.text(count, x + 470, y);
  hud.text(growth, x + 600, y);
}

function drawGraph(g, data, x, y, w, h, title, xLabel, yLabel) {
  g.push();

  g.fill(20);
  g.textAlign(CENTER, TOP);
  g.textSize(15);

  g.text(
    title,
    x + w / 2,
    y - 30
  );

  g.stroke(20);

  g.line(
    x,
    y + h,
    x + w,
    y + h
  );

  g.line(
    x,
    y,
    x,
    y + h
  );

  let maxValue = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].average > maxValue) {
      maxValue = data[i].average;
    }
  }

  let previousX = 0;
  let previousY = 0;

  for (let i = 0; i < data.length; i++) {
    let px = map(
      i,
      0,
      data.length - 1,
      x + 20,
      x + w - 20
    );

    let py = map(
      data[i].average,
      0,
      maxValue,
      y + h - 20,
      y + 20
    );

    if (i > 0) {
      g.stroke(20);

      g.line(
        previousX,
        previousY,
        px,
        py
      );
    }

    g.noStroke();
    g.fill(20);

    g.circle(
      px,
      py,
      8
    );

    g.textAlign(CENTER, TOP);
    g.textSize(11);

    g.text(
      data[i].input,
      px,
      y + h + 5
    );

    g.text(
      floor(data[i].average),
      px,
      py - 18
    );

    previousX = px;
    previousY = py;
  }

  g.textAlign(CENTER, TOP);
  g.textSize(12);

  g.text(
    xLabel,
    x + w / 2,
    y + h + 25
  );

  g.push();

  g.translate(
    x - 40,
    y + h / 2
  );

  g.rotate(-HALF_PI);

  g.text(
    yLabel,
    0,
    0
  );

  g.pop();

  g.pop();
}

function getModuleTitle() {
  let titles = [
    "",
    "Module 1 - Shapes",
    "Module 2 - Sierpinski",
    "Module 3 - Transformations",
    "Module 4 - Camera",
    "Module 5 - Measure"
  ];

  return titles[currentModule];
}