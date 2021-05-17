import * as PIXI from 'pixi.js'

export function textureCreater(data: Blob) {
  return new Promise<PIXI.BaseTexture>((resolve: Function, reject: Function) => {
    const img = new Image()
    img.onload = () => {
      img.onload = undefined
      img.onerror = undefined
      resolve(new PIXI.BaseTexture(img))
    }
    img.onerror = (ev) => {
      img.onload = undefined
      img.onerror = undefined
      reject(ev.toString())
    }
    img.src = URL.createObjectURL(data)
  })
}