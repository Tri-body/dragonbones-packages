
export class TimeTicker {
  private _time: number
  private _pass: number
  private _callback: (deltaTime: number) => void
  private _context: any
  private _isRuning: boolean = false
  private _delay: number

  public start(delay: number, callback: (deltaTime: number) => void, callbackContext?: any): void {
    if (!callback) {
      return
    }
    this.stop()
    this._delay = delay
    this._callback = callback
    this._context = callbackContext
    this._time = 0
    this._isRuning = true
    requestAnimationFrame(this.onTick)
  }

  public stop(): void {
    this._isRuning = false
    this._callback = null
    this._context = null
  }

  public dispose(): void {
    this.stop()
  }

  private onTick = (timeStamp: number) => {
    if (!this._isRuning) return
    if (!this._time) {
      this._time = timeStamp
    }
    this._pass = timeStamp - this._time
    if (this._pass >= this._delay) {
      this._time = timeStamp
      this._callback.call(this._context, this._pass / 1000)
    }
    requestAnimationFrame(this.onTick)
  }
}