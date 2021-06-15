import { TextureAtlasData, TextureData, BaseObject } from 'dragonbonesjs-module'
import * as PIXI from 'pixi.js'

/**
 * - The PixiJS texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - PixiJS 贴图集数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
export class PixiTextureAtlasData extends TextureAtlasData {
  public static toString(): string {
    return '[class dragonBones.PixiTextureAtlasData]'
  }

  private _renderTexture: PIXI.BaseTexture | null = null // Initial value.

  protected _onClear(): void {
    super._onClear()

    if (this._renderTexture !== null) {
      // this._renderTexture.dispose();
    }

    this._renderTexture = null
  }
  /**
   * @inheritDoc
   */
  public createTexture(): TextureData {
    return BaseObject.borrowObject(PixiTextureData)
  }
  /**
   * - The PixiJS texture.
   * @version DragonBones 3.0
   * @language en_US
   */
  /**
   * - PixiJS 贴图。
   * @version DragonBones 3.0
   * @language zh_CN
   */
  public get renderTexture(): PIXI.BaseTexture | null {
    return this._renderTexture
  }

  public set renderTexture(value: PIXI.BaseTexture | null) {
    if (this._renderTexture === value) {
      return
    }

    this._renderTexture = value

    if (this._renderTexture !== null) {
      for (let k in this.textures) {
        const textureData = this.textures[k] as PixiTextureData
        const { region } = textureData
        // fix invalid texture region
        if (region.x + region.width > this._renderTexture.width) {
          console.warn(`texture fault x: ${region.x} + ${region.width} = ${region.x + region.width} > ${this._renderTexture.width}`)
          region.width = this._renderTexture.width - region.x
        }
        if (region.y + region.height > this._renderTexture.height) {
          console.warn(`texture fault y: ${region.y} + ${region.height} = ${region.y + region.height} > ${this._renderTexture.height}`)
          region.height = this._renderTexture.height - region.y
        }
        textureData.renderTexture = new PIXI.Texture(
          this._renderTexture,
          <any> region as PIXI.Rectangle, // No need to set frame.
          <any> region as PIXI.Rectangle,
          new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height),
          textureData.rotated as any // .d.ts bug
        )
      }
    } else {
      for (let k in this.textures) {
        const textureData = this.textures[k] as PixiTextureData
        textureData.renderTexture = null
      }
    }
  }
}
/**
 * @internal
 */
export class PixiTextureData extends TextureData {
  public static toString(): string {
    return '[class dragonBones.PixiTextureData]'
  }

  public renderTexture: PIXI.Texture | null = null // Initial value.

  protected _onClear(): void {
    super._onClear()

    if (this.renderTexture !== null) {
      this.renderTexture.destroy(false)
    }

    this.renderTexture = null
  }
}