class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toObject() {
    return {x: this.x, y: this.y};
  }

  toArray() {
    return [this.x, this.y];
  }

  rotate(angle) {
    angle = -angle * (Math.PI/180);
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Vector2(Math.round(10000*(this.x * cos - this.y * sin))/10000, Math.round(10000*(this.x * sin + this.y * cos))/10000);
  }
}

module.exports = Vector2;