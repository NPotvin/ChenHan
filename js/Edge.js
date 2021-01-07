class Edge {
  constructor(start, end, face) {
    const vect = p5.Vector.sub(end.p5V, start.p5V);
    this.start = start;
    this.end = end;
    this.magnitude = vect.mag();
    this._cut = false;
    this._cornerEdge = true;
    this.vector = vect.normalize();
    this.face = face;
    this._paired = null;
  }

  get paired() {
    return this._paired;
  }

  set paired(other) {
    this._paired = other;
    const flatness = abs(sin(this.face.normal.angleBetween(other.face.normal)));
    this._cornerEdge = flatness > 0.01;
  }

  get corner() {
    return this._cornerEdge;
  }

  get shadow() {
    return this._paired.face;
  }

  get cut() {
    return this._cut;
  }

  set cut(value) {
    this._cut = value;
    this._paired._cut = value;
  }

  unfold(p) {
    /**
     * p is the image point, n the normal of the face, e this edge's vector and v is the cross product e X n
     *
     * p', n' and v' are their respective equivalent for the shadow face (e is unchanged)
     *
     * p = a*n + b*e + c*v
     * p' = a*n' + b*e + c*v'
     *
     */
    const nFace = this.face.normal;
    const nShadow = this.shadow.normal;
    const e = this.vector;
    const vFace = e.cross(nFace);
    const vShadow = e.cross(nShadow);

    const alpha1 = p.x / nFace.x;
    const alpha2 = e.x / nFace.x;
    const alpha3 = vFace.x / nFace.x;
    // a = alpha1 - b*alpha2 - c*alpha3

    const beta1 = (p.y - alpha1 * nFace.y) / (e.y - alpha2 * nFace.y);
    const beta2 = (vFace.y - alpha3 * nFace.y) / (e.y - alpha2 * nFace.y);
    // b = beta1 - c*beta2

    const c =
      (p.z - alpha1 * nFace.z - beta1 * (e.z - alpha2 * nFace.z)) /
      (vFace.z - alpha3 * nFace.z - beta2 * (e.z - alpha2 * nFace.z));
    const b = beta1 - c * beta2;
    const a = alpha1 - b * alpha2 - c * alpha3;
    return p5.Vector.add(
      p5.Vector.add(p5.Vector.mult(nShadow, a), p5.Vector.mult(e, b)),
      p5.Vector.mult(vShadow, c)
    );
  }
}
