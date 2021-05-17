import { PixiArmatureDisplay } from './PixiArmatureDisplay'
import { SkMovie } from '@gnoijli/dragonbones-helper'

export class PixiSkMovie extends SkMovie {

  public get display(): PixiArmatureDisplay {
    return this._display
  }

  public fitSize(width: number, height: number, center: boolean = true) {
    const target = this.display
    if (!target) return
    let scale = 1
    target.scale.set(scale, scale)
    const { width: w, height: h } = target.getBounds()
    const ratio = width / height
    const targetRatio = w / h
    if (ratio > targetRatio) {
      scale = height / h
    } else {
      scale = width / w
    }
    target.scale.set(scale, scale)
    if (center) {
      const bounds = target.getBounds()
      target.x = (width - bounds.width) * 0.5
      target.y = (height - bounds.height) * 0.5
    }
  }

}