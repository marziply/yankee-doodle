export default class Flag {
  constructor (flag) {
    this.flag = flag
  }

  on (flag, callback) {
    if (this.flag === flag) {
      callback()
    }
  }
}
