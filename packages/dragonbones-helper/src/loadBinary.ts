export function loadBinary(url: string, timeout: number = 0) {
  return new Promise<ArrayBuffer>(function (resolve: Function, reject: Function) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.timeout = timeout
    xhr.onload = function () {
      xhr.onload = undefined
      xhr.onerror = undefined
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        resolve(xhr.response)
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        })
      }
    }
    xhr.onerror = function () {
      xhr.onload = undefined
      xhr.onerror = undefined
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      })
    }
    xhr.send()
  })
}