class Face {
  constructor(vertices, ids) {
    this.length = ids.length;
    this.ids = ids;
    this.vertices = [];
    this.flatVertices = [];
    this.hasBeenCut = false;
    this.edges = [];
    this.ids.forEach((id) => {
      this.vertices.push(vertices[id]);
      this.flatVertices.push(null);
    });
    for (let i = 0; i < this.length; ++i) {
      const edge = new Edge(
        this.vertices[i],
        this.vertices[(i + 1) % this.length],
        this
      );
      this.edges.push(edge);
    }
    this.normal = this.edges[0].vector.cross(this.edges[1].vector).normalize();
    this.edges.forEach((edge) => {
      edge.start.addEdge(edge);
      edge.end.addEdge(edge);
    });
  }

  mark() {
    this.hasBeenCut = true;
  }

  reset() {
    this.hasBeenCut = false;
    for (let i = 0; i < this.length; ++i) this.flatVertices[i] = null;
    this.edges.forEach((edge) => (edge.cut = false));
  }

  setFlat(id, vertex) {
    let i = 0;
    while (i < this.length && this.ids[i] !== id) ++i;
    this.flatVertices[i] = vertex;
  }

  setShadowVertices(startId, endId) {
    if (!this.edges[startId].cut) {
      this.edges[startId].shadow.setFlat(
        this.ids[startId],
        this.flatVertices[startId]
      );
      this.edges[startId].shadow.setFlat(
        this.ids[endId],
        this.flatVertices[endId]
      );
    }
  }

  flattenShadows(scale) {
    for (let i = 0; i < this.length; ++i)
      if (!this.edges[i].cut) {
        const shadow = this.edges[i].shadow;
        let flat = true;
        for (let j = 0; flat && j < shadow.length; ++j)
          flat = !Object.is(shadow.flatVertices[j], null);
        if (!flat) shadow.flatten(scale);
      }
  }

  firstFlatVertex(scale) {
    let first = 0;
    while (
      first < this.length &&
      !(
        this.flatVertices[first] && this.flatVertices[(first + 1) % this.length]
      )
    )
      ++first;
    if (first === this.length) {
      const baseLength = this.edges[0].magnitude;
      this.flatVertices[0] = createVector((-baseLength * scale) / 2);
      this.flatVertices[1] = createVector((baseLength * scale) / 2);
      this.setShadowVertices(0, 1);
      first = 0;
    }
    return first;
  }

  flatten(scale) {
    const start = this.firstFlatVertex(scale);
    for (let l = 0; l < this.length - 1; ++l) {
      const i = (start + l) % this.length;
      const j = (start + l + 1) % this.length;
      const k = (start + l + 2) % this.length;
      const edgeVector = p5.Vector.sub(
        this.flatVertices[j],
        this.flatVertices[i]
      );
      edgeVector.rotate(
        -abs(this.edges[i].vector.angleBetween(this.edges[j].vector))
      );
      edgeVector.setMag(this.edges[j].magnitude);
      edgeVector.mult(scale);
      this.flatVertices[k] = p5.Vector.add(this.flatVertices[j], edgeVector);
      this.setShadowVertices(j, k);
    }
    this.flattenShadows(scale);
  }
}
