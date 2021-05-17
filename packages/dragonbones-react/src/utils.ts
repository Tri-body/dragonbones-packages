export function isEqualObject(a: any, b: any): boolean {
  if (!a || !b) return false
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  const aLen = aProps.length
  if (aLen !== bProps.length) {
    return false
  }
  let propName: string
  for (let i = 0; i < aLen; i++) {
    propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

export function assginObject(target: any, source: any): void {
  if (!source || !target) {
    return
  }
  Object.getOwnPropertyNames(source).forEach(key => {
    target[key] = source[key]
  })
}
