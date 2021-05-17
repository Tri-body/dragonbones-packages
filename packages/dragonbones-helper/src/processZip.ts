import { dbToNew, DragonBonesXmlUtil } from 'dragonbones-converter'
import * as JSZip from 'jszip'
import { setAutoTween } from './skeletonUtil'

const SKELETON_BIN = 'skeleton.dbbin'
const SKELETON_JSON = 'skeleton.json'
const TEXTURE_JSON = 'texture.json'
const TEXTURE_PNG = 'texture.png'
const SKELETON_XML = 'skeleton.xml'
const TEXTURE_XML = 'texture.xml'
const SKE_BIN = '_ske.dbbin'
const SKE_JSON = '_ske.json'
const TEX_PNG = '_tex.png'
const TEX_JSON = '_tex.json'

export type DBAsset<T = any> = {
  skeletonJson?: any
  textureJson?: any
  texture?: T
}

function findFileBySuffix(zip: JSZip, suffix: string) {
  for (let key in zip.files) {
    if (key.charAt(0) !== '.' && key.substr(-suffix.length) === suffix) {
      return zip.file(key)
    }
  }
  return null
}

export async function processZip<T = any>(bin: ArrayBuffer, textureCreater: (value: Blob) => Promise<T>, toV3: boolean = true) {
  const ret: DBAsset<T> = {}
  const zip = await JSZip.loadAsync(bin)
  let zipObj: JSZip.JSZipObject

  // texture data
  if (zipObj = zip.file(TEXTURE_JSON) || findFileBySuffix(zip, TEX_JSON)) {
    const texJsonStr = await zipObj.async('text')
    ret.textureJson = JSON.parse(texJsonStr)
  } else if (zipObj = zip.file(TEXTURE_XML)) {
    const texXmlStr = await zipObj.async('text')
    ret.textureJson = DragonBonesXmlUtil.parseXmlStrToJson(texXmlStr)
  }

  // skelton data
  if (zipObj = zip.file(SKELETON_XML)) {
    const xmlStr = await zipObj.async('text')
    ret.skeletonJson = DragonBonesXmlUtil.parseXmlStrToJson(xmlStr, toV3)
    setAutoTween(ret.skeletonJson, false)  // fix回放bug
    ret.skeletonJson = dbToNew(ret.skeletonJson, ret.textureJson)
  } else if (zipObj = zip.file(SKELETON_JSON) || findFileBySuffix(zip, SKE_JSON)) {
    const jsonStr = await zipObj.async('text')
    ret.skeletonJson = JSON.parse(jsonStr)
    const version = ret.skeletonJson['version']
    if (version === '3.3' || version === '2.3') {
      setAutoTween(ret.skeletonJson, false)  // fix回放bug
    }
    if (version !== '5.5') {
      ret.skeletonJson = dbToNew(ret.skeletonJson, ret.textureJson)
    }
  } else if (zipObj = zip.file(SKELETON_BIN) || findFileBySuffix(zip, SKE_BIN)) {
    ret.skeletonJson = await zipObj.async('arraybuffer')
  }

  // skeleton texture
  if (zipObj = zip.file(TEXTURE_PNG) || findFileBySuffix(zip, TEX_PNG)) {
    const skBlob = await zipObj.async('blob')
    ret.texture = await textureCreater(skBlob)
  }
  return ret
}