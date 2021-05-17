import { Armature, EventObject } from 'dragonbonesjs-module'
import { TimeTicker } from './TimerTicker'
import { getChildArmature, clearAnimationFadeInTime, setAnimationLoop } from './skeletonUtil'

export class SkMovie {

  protected _armature: Armature
  protected _movementList: string[]
  protected _curtMovement: string
  protected _childArmatureList: Armature[]
  protected _display: any
  protected _timeTicker: TimeTicker
  protected _onComplete: Function
  protected _onCompleteContext: any
  protected _backStart: boolean = false

  constructor(armature: Armature) {
    this._armature = armature
    this.initArmature()
  }

  public initArmature(): void {
    if (!this._armature) {
      console.warn('armature is null !!')
      return
    }
    this._timeTicker = new TimeTicker()
    this._display = this._armature.display
    this._movementList = this._armature.animation.animationNames
    this._curtMovement = this._movementList[0]
    this._childArmatureList = getChildArmature(this._armature, false)
    this._display.addEvent(EventObject.COMPLETE, this.onCompleteHandler, this)
  }

  public setCompleteCallback(func: Function, context?: any) {
    this._onComplete = func
    this._onCompleteContext = context
  }

  protected onCompleteHandler(): void {
    this.stop(this._backStart)
    if (this._onComplete) {
      this._onComplete.call(this._onCompleteContext)
    }
  }

  public play(loop: number = 0, delay: number = 40, backStart: boolean = false): void {
    if (!this._armature || this._armature.animation.isPlaying) {
      return
    }
    this._backStart = backStart
    loop = Math.abs(loop)
    this._timeTicker.start(delay, this.advanceTime, this)
    this._armature.animation.play(this._curtMovement, loop)
    for (let i = 0, l = this._childArmatureList.length; i < l; ++i) {
      this._childArmatureList[i].animation.play(this._curtMovement, loop)
    }
  }

  public stop(backStart: boolean = true): void {
    if (!this._armature) {
      return
    }
    this._timeTicker.stop()
    if (backStart) {
      this._armature.animation.play(this._curtMovement)
      for (let i = 0, l = this._childArmatureList.length; i < l; ++i) {
        this._childArmatureList[i].animation.play(this._curtMovement)
      }
      this.advanceTime(0)
    }
    this._armature.animation.stop()
    for (let i = 0, l = this._childArmatureList.length; i < l; ++i) {
      this._childArmatureList[i].animation.stop()
    }
  }

  protected advanceTime(passedTime: number): void {
    this._armature.advanceTime(passedTime)
    for (let i = 0, l = this._childArmatureList.length; i < l; ++i) {
      this._childArmatureList[i].advanceTime(passedTime)
    }
  }

  public get isPlaying(): boolean {
    return this._armature.animation.isPlaying
  }

  public get timeScale(): number {
    return this._armature.animation.timeScale
  }

  public set timeScale(val: number) {
    this._armature.animation.timeScale = val
  }

  public get armatrue(): Armature {
    return this._armature
  }

  public get movementList(): string[] {
    return this._movementList
  }

  public get curtMovement(): string {
    return this._curtMovement
  }

  public set curtMovement(val: string) {
    if (this._curtMovement !== val && this._movementList.indexOf(val) !== -1) {
      this._curtMovement = val
      this.stop()
    }
  }

  public dispose(): void {
    this.stop(false)
    if (this._display) {
      this._display.removeEvent(EventObject.LOOP_COMPLETE, this.onCompleteHandler, this)
      this._display = null
    }
    if (this._timeTicker) {
      this._timeTicker.dispose()
      this._timeTicker = null
    }
    if (this._armature) {
      this._armature.dispose()
      this._armature = null
    }
    if (this._childArmatureList) {
      this._childArmatureList.length = 0
      this._childArmatureList = null
    }
    this._movementList = null
  }

  public clearFadeInTime(): void {
    for (let i = 0, l = this._childArmatureList.length; i < l; ++i) {
      clearAnimationFadeInTime(this._childArmatureList[i].animation)
    }
    clearAnimationFadeInTime(this._armature.animation)
  }

  /**
   * 
   * @deprecated 已废弃，可能引起bug
   */
  public setChildArmatureLoop(loop: number): void {
    for (let i = 0, len = this._childArmatureList.length; i < len; ++i) {
      setAnimationLoop(this._childArmatureList[i].animation, loop)
    }
  }

  public get armatureName(): string {
    return this._armature ? this._armature.name : null
  }
}