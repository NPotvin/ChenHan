function displayFace(face, edgeColor = "black") {
  stroke(edgeColor);
  strokeWeight(4);
  fill(0, 0, 0, 0);
  beginShape();
  face.vertices.forEach((v) => vertex(v.x, v.y, v.z));
  endShape(CLOSE);
  strokeWeight(1);
}

function displayPoint(point, edgeColor = "black", fillColor = "white") {
  stroke(edgeColor);
  strokeWeight(8);
  fill(fillColor);
  beginShape(POINTS);
  vertex(point.x, point.y, point.z);
  endShape();
  strokeWeight(1);
}

function displayPolyhedron(
  faces,
  route,
  sourceFace,
  sourcePoint,
  targetFace,
  targetPoint
) {
  rotateX(frameCount * 0.015);
  rotateY(frameCount * 0.015);
  model(poly);
  if (route) {
    stroke("red");
    fill(255, 165, 0, 140); // transparent orange
    route.forEach((path) => {
      path.forEach((shape) => {
        beginShape();
        shape.forEach((v) => vertex(v.x, v.y, v.z));
        endShape(CLOSE);
      });
    });
    displayFace(sourceFace, "lime");
    displayPoint(sourcePoint, "lime");
    displayFace(targetFace, "blue");
    displayPoint(targetPoint, "blue");
    stroke("black");
    fill("white");
  }
}

function displayFlatFace(face, point, color) {
  if (point) {
    stroke(color);
    fill(color);
    ellipse(point.x, point.y, 6, 6);
    for (let j = 0; j < face.length; ++j) {
      const k = (j + 1) % face.length;
      line(
        face.flatVertices[j].x,
        face.flatVertices[j].y,
        face.flatVertices[k].x,
        face.flatVertices[k].y
      );
    }
  }
}

function displayCutPoly(
  faces,
  sourceFace,
  flatSourcePoint,
  targetFace,
  flatTargetPoint,
  displayScale
) {
  faces.forEach((face) => {
    triangle(
      face.flatVertices[0].x,
      face.flatVertices[0].y,
      face.flatVertices[1].x,
      face.flatVertices[1].y,
      face.flatVertices[2].x,
      face.flatVertices[2].y
    );
    for (let j = 0; j < face.length; ++j) {
      const k = (j + 1) % face.length;
      if (face.edges[j].cut) stroke("red");
      else if (!face.edges[j].corner) stroke("lightgray");
      line(
        face.flatVertices[j].x,
        face.flatVertices[j].y,
        face.flatVertices[k].x,
        face.flatVertices[k].y
      );
      stroke("black");
    }
  });
  fill("black");
  ellipse(
    (mouseX - width / 2) / displayScale,
    (mouseY - height / 2) / displayScale,
    6,
    6
  );
  displayFlatFace(sourceFace, flatSourcePoint, "lime");
  displayFlatFace(targetFace, flatTargetPoint, "blue");
  stroke("black");
  fill("white");
}
