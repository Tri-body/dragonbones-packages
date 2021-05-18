import * as PIXI from 'pixi.js'
import { IProps } from './IProps'
import { PixiSkMovie, PixiSkItem } from '@gnoijli/dragonbones-pixi4'
import { isEqualObject, assginObject } from './utils'

const defaultProps: PIXI.ApplicationOptions = {
  transparent: true
}

export class DBPlayer {

  private _app: PIXI.Application
  private _movie: PixiSkMovie
  private _curtProps: IProps
  private _loading = false
  private _item: PixiSkItem

  constructor(props: IProps) {
    const forceCanvas = props.renderer === 'canvas' ? true : false
    this._app = new PIXI.Application(props.width, props.height, { ...defaultProps, ...props.options, forceCanvas })
    const parent = document.getElementById(props.parent)
    if (parent) {
      parent.appendChild(this._app.view)
    }
    this.update(props)
  }

  public update(props: IProps) {
    if (!props) return
    if (!this._curtProps) {
      this._curtProps = {
        url: '',
        width: 0,
        height: 0,
        parent: '',
        armature: '',
        movement: '',
        offsetX: 0,
        offsetY: 0,
      }
    }
    const newProps = { ...this._curtProps, ...props }
    let needLoad = false
    let needChangeMovie = false
    let needChangeStatus = false
    if (newProps.url && this._curtProps.url !== props.url) {
      needLoad = true
      this.cleanFile()
    } else if (newProps.armature !== this._curtProps.armature) {
      needChangeMovie = true
    } else if (newProps.movement !== this._curtProps.movement
      || newProps.isPlay !== this._curtProps.isPlay
      || newProps.loop !== this._curtProps.loop
      || newProps.width !== this._curtProps.width
      || newProps.height !== this._curtProps.height
      || newProps.offsetX !== this._curtProps.offsetX
      || newProps.offsetY !== this._curtProps.offsetY
    ) {
      needChangeStatus = true
    }
    if (newProps.canvasStyle && !isEqualObject(newProps.canvasStyle, this._curtProps.canvasStyle)) {
      assginObject(this._app.view.style, newProps.canvasStyle)
    }
    this._curtProps = newProps
    if (needLoad) {
      this.loadFile()
    } else if (needChangeMovie) {
      this.changeMovie()
    } else if (needChangeStatus) {
      this.changeStatus()
    }
  }

  private playComplete(): void {
    this.stopCurtMovie()
    if (this._curtProps && this._curtProps.onComplete) {
      this._curtProps.onComplete()
    }
  }

  private removeCurtMovie(): void {
    this.stopCurtMovie(false)
    if (this._movie && this._movie.display && this._movie.display.parent) {
      this._movie.display.parent.removeChild(this._movie.display)
      this._movie.dispose()
      this._movie = null
    }
  }

  private playCurtMovie(): void {
    if (this._movie) {
      this._movie.setCompleteCallback(this.playComplete, this)
      this._movie.play(this._curtProps.loop)
      this._app.start()
    }
  }

  private stopCurtMovie(backStart: boolean = true): void {
    if (this._movie) {
      this._movie.stop(backStart)
      this._movie.setCompleteCallback(null, null)
    }
    if (this._curtProps) {
      this._curtProps.isPlay = false
    }
    if (this._app) {
      this._app.stop()
      this._app.render() // 手动render一次
    }
  }

  private changeMovie(): void {
    if (this._movie) this.removeCurtMovie()
    if (this._item) {
      this._movie = this._item.createMovie(this._curtProps.armature)
      if (this._movie && this._movie.display) {
        this._movie.clearFadeInTime()
        this._movie.stop()
        this._app.stage.addChild(this._movie.display)
        this.changeStatus()
      }
    }
  }

  private changeStatus(): void {
    if (this._movie) {
      const { movement, isPlay, width, height, offsetX, offsetY } = this._curtProps
      this._movie.curtMovement = movement
      this._movie.fitSize(width, height, offsetX, offsetY)
      if (isPlay) {
        this.playCurtMovie()
      } else {
        this.stopCurtMovie()
      }
    }
  }

  private async loadFile() {
    if (this._loading) {
      return
    }
    const { url } = this._curtProps
    if (url) {
      this._loading = true
      try {
        const item = await PixiSkItem.loadUrl(url)
        this.realCreate(item)
      } catch (e) {
        console.error(e)
        this.realCreate(null)
      }
    }
  }

  private realCreate(item: PixiSkItem): void {
    this._item = item
    this._loading = false
    if (this._item && this._item.key !== this._curtProps.url) {
      this.cleanFile()
      this.loadFile()
    } else {
      this.changeMovie()
    }
  }

  private cleanFile(): void {
    this.removeCurtMovie()
    if (this._item) {
      this._item.destroy()
      this._item = null
    }
    this._movie = null
  }

  public destroy() {
    this.removeCurtMovie()
    if (this._app) {
      this._app.destroy()
      this._app = null
    }
    if (this._item) {
      this._item.destroy()
      this._item = null
    }
  }

}
