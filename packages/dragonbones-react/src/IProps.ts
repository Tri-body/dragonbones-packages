import * as CSS from 'csstype'
import React from 'react';

export interface IProps {
  url: string
  width: number
  height: number
  armature?: string
  movement?: string
  isPlay?: boolean
  loop?: number
  renderer?: 'auto' | 'canvas' | 'webgl'
  styles?: React.CSSProperties
  canvasStyle?: CSS.Properties
  onPlayComplete?: Function
  options?: PIXI.ApplicationOptions
}
