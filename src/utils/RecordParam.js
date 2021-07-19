
export default class RecordParam {
  current = 1
  size = 20
  total = 0

  constructor ({ current, size, total }) {
    this.current = current
    this.size = size
    this.total = total
  }

  getData (fun, ...query) {
    return new Promise((resolve, reject) => {
      if (this.current * this.size >= this.total) {
        resolve([])
        return
      }
      fun(...query).then(({ data }) => {
        if (data.total > this.total) {
          this.total = data.total
        }
        this.current = ++data.current
        resolve(data.records)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}
