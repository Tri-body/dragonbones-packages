## `dragonbones-pixi4`

>  dragonbones render by pixi.js v4

#### Usage

```sh
npm i @gnoijli/dragonbones-pixi4
```

```js

import { PixiSkItem } from '@gnoijli/dragonbones-pixi4'
import * as PIXI from 'pixi.js'
import * as dragon from './assets/dragon.zip'

async function init() {
  const item = await PixiSkItem.loadUrl(dragon)
  for (let i = 0; i < 1; i++) {
    const movie = item.createMovie('Dragon')
    movie.curtMovement = 'walk'
    movie.fitSize(300, 300, 150, 150)
    const app = new PIXI.Application({
      transparent: true,
      width: 300,
      height: 300,
      forceCanvas: true
    })
    document.body.appendChild(app.view)
    app.stage.addChild(movie.display)
    const btn = document.createElement('button')
    btn.innerText = 'play'
    btn.onclick = () => {
      if (movie.isPlaying) {
        movie.stop()
        btn.innerText = 'play'
      } else {
        movie.play()
        btn.innerText = 'stop'
      }
    }
    document.body.appendChild(btn)
  }
}

window.onload = function () {
  init()
}

```

