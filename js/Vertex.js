class Vertex {
  constructor(p5Vertex) {
    this.p5V = p5Vertex;
    this.edges = [];
  }

  get x() {
    return this.p5V.x;
  }

  get y() {
    return this.p5V.y;
  }

  get z() {
    return this.p5V.z;
  }

  addEdge(edge) {
    let found = false;
    const order = Object.is(edge.start, this) ? 0 : 1;
    const neighbour = function (v, e) {
      return Object.is(e.start, v) ? e.end : e.start;
    };
    for (let i = 0; !found && i < this.edges.length; ++i)
      if (!this.edges[i][order]) {
        const paired = this.edges[i][(order + 1) % 2];
        if (Object.is(neighbour(this, edge), neighbour(this, paired))) {
          found = true;
          paired.paired = edge;
          edge.paired = paired;
          this.edges[i][order] = edge;
        }
      }
    if (!found) {
      this.edges.push([null, null]);
      this.edges[this.edges.length - 1][order] = edge;
    }
  }
}
