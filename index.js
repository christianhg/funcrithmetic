const FR = {
  of(x) {
    return {
      ap(fr) {
        return fr.map(x)
      },
      chain(f) {
        return this.isNumber() ? f(x) : FR.of(undefined)
      },
      isNumber() {
        return typeof x === 'number' && isFinite(x)
      },
      map(f) {
        return this.isNumber() ? FR.of(f(x)) : FR.of(undefined)
      },
      valueOf() {
        return this.isNumber() ? x : undefined
      },

      add(b) {
        return this.map(a => a + b)
      },
      dec() {
        return this.map(a => a - 1)
      },
      div(b) {
        return this.map(a => a / b)
      },
      inc() {
        return this.map(a => a + 1)
      },
      exp(b) {
        return this.map(a => a ** b)
      },
      mul(b) {
        return this.map(a => a * b)
      },
      neg() {
        return this.map(a => -a)
      },
      sub(b) {
        return this.map(a => a - b)
      },
      subFrom(b) {
        return this.map(a => b - a)
      },
      sqr() {
        return this.map(a => a ** 2)
      },
      sqrt() {
        return this.map(a => Math.sqrt(a))
      }
    }
  }
}

module.exports = FR
