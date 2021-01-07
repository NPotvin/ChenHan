function locateProjection(i, s, p, v) {
  /**
   * i is the (source) image point, s is an endpoint of the segment to project
   * p is a point of the line on which the projection is made, v is its vector
   *
   * vector e = i->s forms a line
   *
   * the point we are looking for is the intersection between i + a*e and p + b*v
   */
  const e = p5.Vector.sub(s, i);
  const b = (p.y - i.y - ((p.x - i.x) * e.y) / e.x) / ((v.x * e.y) / e.x - v.y);
  const a = (p.x + b * v.x - i.x) / e.x;
  //return p5.Vector.add(i, p5.Vector.mult(e, a));
  //return p5.Vector.add(p, p5.Vector.mult(v, b));
  return [a, b];
}

class Projection {
  constructor(img, proj, edge) {
    const v = edge.vector;
    const p = edge.start.p5V;
    let start = proj.start;
    let end = proj.end;
    if (p5.Vector.sub(end, start).dot(edge.vector) < 0) {
      start = proj.end;
      end = proj.start;
    }
    const [aStart, bStart] = locateProjection(img, start, p, v);
    const [aEnd, bEnd] = locateProjection(img, end, p, v);
    this.start = null;
    this.end = null;
    if (bStart <= bEnd) {
      if (bStart <= 0 || aStart < 0) this.start = p;
      else if (bStart <= edge.magnitude)
        this.start = p5.Vector.add(p, p5.Vector.mult(v, bStart));
      if (bEnd >= edge.magnitude || aEnd < 0) this.end = edge.end.p5V;
      else if (bEnd >= 0) this.end = p5.Vector.add(p, p5.Vector.mult(v, bEnd));
    }
  }

  empty() {
    return !(this.start && this.end);
  }
}
