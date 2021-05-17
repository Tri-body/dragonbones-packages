/// <reference path="../typings/index.d.ts" />
import { PixiSkItem } from '@gnoijli/dragonbones-pixi4'
import * as dragon from './assets/dragon.zip'
import * as PIXI from 'pixi.js'

async function start() {
  const item = await PixiSkItem.loadUrl(dragon)
  for (let i = 0; i < 1; i++) {
    const movie = item.createMovie('Dragon')
    movie.curtMovement = 'walk'
    movie.fitSize(300, 300, false)
    movie.display.x = 150
    movie.display.y = 150
    const app = new PIXI.Application({
      transparent: true,
      width: 300,
      height: 300,
      forceCanvas: true
    })
    document.body.appendChild(app.view)
    app.stage.addChild(movie.display)
    const btn = document.createElement('button')
    btn.innerText = '播放'
    btn.onclick = () => {
      if (movie.isPlaying) {
        movie.stop()
        btn.innerText = '播放'
      } else {
        movie.play()
        btn.innerText = '停止'
      }
    }
    document.body.appendChild(btn)
  }
}

window.onload = function () {
  start().catch(r => {
    console.warn(r)
  })
}