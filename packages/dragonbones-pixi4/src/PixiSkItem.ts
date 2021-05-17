import * as PIXI from 'pixi.js'
import { PixiFactory } from './PixiFactory'
import { loadBinary, processZip, DBAsset } from '@gnoijli/dragonbones-helper'
import { textureCreater } from './textureCreater'
import { PixiSkMovie } from './PixiSkMovie'

export class PixiSkItem {
  public autoTween: boolean = false // autoTween属性可能导致播放异常
  private _key: string
  private _skeletonJson: any
  private _textureJson: any
  private _texture: PIXI.BaseTexture
  private _bgTexture: PIXI.BaseTexture
  private _factory: PixiFactory

  public constructor(key: string, skeletonJson: any, textureJson: any, texture: PIXI.BaseTexture) {
    this._key = key
    this._skeletonJson = skeletonJson
    this._textureJson = textureJson
    this._texture = texture
  }

  public static async loadUrl(url: string, toV3: boolean = true) {
    const zip = await loadBinary(url)
    return await this.loadBin(url, zip, toV3)
  }

  public static async loadBin(key: string, zip: ArrayBuffer, toV3: boolean = true) {
    const asset = await processZip(zip, textureCreater, toV3)
    return await PixiSkItem.create(key, asset)
  }

  private static create(key: string, asset: DBAsset) {
    const { skeletonJson, texture, textureJson } = asset
    if (skeletonJson && textureJson && texture) {
      return Promise.resolve(new PixiSkItem(key, skeletonJson, textureJson, texture))
    } else {
      return Promise.reject(`create DragonBonesItem fail! key: ${key}, reason: file missing!`)
    }
  }

  public getFactory(): PixiFactory {
    if (!this._factory) {
      if (this._skeletonJson && this._textureJson && this._texture) {
        this._factory = new PixiFactory()
        this._factory.parseDragonBonesData(this._skeletonJson)
        this._factory.parseTextureAtlasData(this._textureJson, this._texture)
        return this._factory
      } else {
        console.warn(`create PhaserFactory fail!`)
      }
    }
    return this._factory
  }

  public destroy(): void {
    if (this._factory) {
      this._factory.clear(true)
      this._factory = null
    }
    if (this._texture) {
      this._texture.destroy()
      this._texture = null
    }
    if (this._bgTexture) {
      this._bgTexture.destroy()
      this._bgTexture = null
    }
    this._skeletonJson = null
    this._textureJson = null
    this._key = null
  }

  public get bgTexture(): PIXI.BaseTexture {
    return this._bgTexture
  }

  public get key(): string {
    return this._key
  }

  public createMovie(name: string): PixiSkMovie {
    if (this.getFactory()) {
      return new PixiSkMovie(this._factory.buildArmature(name))
    }
    return null
  }

  public getArmatureNames(): string[] {
    if (this._skeletonJson && this.getFactory()) {
      return this._factory.getDragonBonesData(this._skeletonJson['name']).armatureNames.concat()
    }
    return null
  }

}