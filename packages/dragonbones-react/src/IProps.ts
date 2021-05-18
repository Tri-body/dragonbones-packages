import * as CSS from 'csstype'
import React from 'react';

export interface IProps {
  url: string
  parent: string
  width: number
  height: number
  armature: string
  movement: string
  offsetX?: number
  offsetY?: number
  isPlay?: boolean
  loop?: number
  renderer?: 'auto' | 'canvas' | 'webgl'
  styles?: React.CSSProperties
  canvasStyle?: CSS.Properties
  onComplete?: Function
  options?: PIXI.ApplicationOptions
}
