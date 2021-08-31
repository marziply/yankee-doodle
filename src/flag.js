export default class Flag {
  constructor (flag) {
    this.flag = flag ?? null
  }

  on (flag, callback) {
    if (this.flag === flag) {
      callback()
    }
  }
}
