function orient(p, q, r) {
  return (q.x - p.x) * (p.y - r.y) - (p.y - q.y) * (r.x - p.x);
}

function isInFace(face, p) {
  const a = face.flatVertices[0];
  const b = face.flatVertices[1];
  const c = face.flatVertices[2];
  if (orient(a, b, c) > 0)
    return orient(a, b, p) > 0 && orient(b, c, p) > 0 && orient(c, a, p) > 0;
  else return orient(a, c, p) > 0 && orient(c, b, p) > 0 && orient(b, a, p) > 0;
}

function buildFaces(poly) {
  let faces = [];
  let vertices = [];
  for (let i = 0; i < poly.vertices.length; ++i)
    vertices.push(new Vertex(p5.Vector.mult(poly.vertices[i], 1.1)));
  for (let i = 0; i < poly.faces.length; ++i) {
    faces.push(
      new Face(vertices, [poly.faces[i][0], poly.faces[i][1], poly.faces[i][2]])
    );
  }
  return faces;
}

function cut(sourceFace) {
  sourceFace.hasBeenCut = true;
  let stack = [sourceFace];
  const innerEdges = [];
  while (stack.length) {
    const nextLevel = [];
    stack.forEach((face) => {
      face.edges.forEach((edge) => {
        edge.cut = true;
        if (!edge.shadow.hasBeenCut) {
          innerEdges.push(edge);
          const parts = [edge.shadow];
          while (parts.length) {
            const part = parts.pop();
            nextLevel.push(part);
            part.hasBeenCut = true;
            part.edges.forEach((shadowEdge) => {
              if (!shadowEdge.corner && !shadowEdge.shadow.hasBeenCut) {
                parts.push(shadowEdge.shadow);
                innerEdges.push(shadowEdge);
              }
            });
          }
        }
      });
    });
    stack = nextLevel;
  }
  innerEdges.forEach((edge) => {
    edge.cut = false;
  });
}

function bindPointToFace(flatPoint, flatFace) {
  const a = p5.Vector.sub(flatFace.flatVertices[1], flatFace.flatVertices[0]);
  const b = p5.Vector.sub(flatFace.flatVertices[2], flatFace.flatVertices[0]);
  const c = p5.Vector.sub(flatPoint, flatFace.flatVertices[0]);
  // c = a*alpha + b*beta
  // compute alpha and beta in the plane
  const alpha = (c.y - (c.x * b.y) / b.x) / (a.y - (a.x * b.y) / b.x);
  const beta = (c.x - (c.y * a.x) / a.y) / (b.x - (a.x * b.y) / a.y);
  // use their value to build the associated 3D vertex
  return p5.Vector.add(
    flatFace.vertices[0].p5V,
    p5.Vector.add(
      p5.Vector.mult(
        p5.Vector.sub(flatFace.vertices[1].p5V, flatFace.vertices[0].p5V),
        alpha
      ),
      p5.Vector.mult(
        p5.Vector.sub(flatFace.vertices[2].p5V, flatFace.vertices[0].p5V),
        beta
      )
    )
  );
}
