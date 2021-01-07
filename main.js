/* eslint-disable no-undef, no-unused-vars */

function locatePoint() {
  let point = createVector(
    (mouseX - width / 2) / displayScale,
    (mouseY - height / 2) / displayScale
  );
  let face = null;
  let i = 0;
  while (i < faces.length && !isInFace(faces[i], point)) ++i;
  if (i !== faces.length) face = faces[i];
  else point = null;
  return { point: point, face: face };
}

function resetPoints() {
  flatSourcePoint = null;
  flatTargetPoint = null;
}

function resetAll() {
  flatSourcePoint = null;
  flatTargetPoint = null;
  sourcePoint = null;
  targetPoint = null;
  route = null;
  targetFace = null;
  sourceFace = faces[0];
}

function setup() {
  can = createCanvas(windowWidth, windowHeight, WEBGL);
  can.mouseClicked(handleClick);
  frameRate(12);
  flatSourcePoint = null;
  flatTargetPoint = null;
  sourcePoint = null;
  targetPoint = null;
}

function preload() {
  loadPoly();
}

function loadPoly() {
  const select = document.getElementById("selectButton");
  const modelFile = select.options[select.selectedIndex].value;
  faces = [];
  flatPoly = false;
  sourceFace = null;
  targetFace = null;
  displayScale = 0.6;
  poly = loadModel(modelFile, true, (geo) => {
    faces = buildFaces(geo);
    sourceFace = faces[0];
  });
  route = null;
}

function draw() {
  // Put drawings here
  background(200);
  scale(displayScale);
  if (flatPoly) {
    displayCutPoly(
      faces,
      sourceFace,
      flatSourcePoint,
      targetFace,
      flatTargetPoint,
      displayScale
    );
  } else {
    displayPolyhedron(
      faces,
      route,
      sourceFace,
      sourcePoint,
      targetFace,
      targetPoint
    );
  }
}

function switchDisplay() {
  if (flatPoly) {
    flatPoly = false;
    if (sourcePoint && targetPoint) {
      route = buildRoute(
        sourcePoint,
        sourceFace,
        targetPoint,
        targetFace,
        faces.length
      );
      resetPoints();
    }
    faces.forEach((face) => face.reset());
    document.getElementById("button1").innerText = "Flatten";
  } else {
    flatPoly = true;
    rotateX(0);
    rotateY(0);
    cut(sourceFace);
    sourceFace.flatten(displayScale);
    document.getElementById("button1").innerText = "Rebuild";
  }
}

function handleClick() {
  if (flatPoly) {
    const { point, face } = locatePoint();
    const boundPoint = bindPointToFace(point, face);
    if (!flatSourcePoint) {
      flatSourcePoint = point;
      sourceFace = face;
      sourcePoint = boundPoint;
    } else {
      flatTargetPoint = point;
      targetFace = face;
      targetPoint = boundPoint;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
