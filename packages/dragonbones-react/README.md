## `dragonbones-react`

> react compoent for show dragonbones, render by pixi

#### Usage

```react
// npm i @gnoijli/dragonbones-react

import ReactDragonBones from '@gnoijli/dragonbones-react'

<div id="container" >
  < ReactDragonBones 
    parent="container"
    renderer="auto"  // default is auto
    options={{ transparent: false, backgroundColor: 0x999999 }} //  default transparent is true
    canvasStyle={{ borderRadius: '10px' }}
    isPlay={this.state.isPlay} 
    url={this.state.url} 
    width={this.state.width} 
    height={this.state.height} 
    />
</div>
```

