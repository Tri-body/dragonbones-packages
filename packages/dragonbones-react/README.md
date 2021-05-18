## `dragonbones-react`

> react compoent for show dragonbones, render by pixi

#### Usage

```react
// npm i @gnoijli/dragonbones-react

import ReactDragonBones from '@gnoijli/dragonbones-react'

function App(props) {
  return (
    <div id="container" style={{ width: '300px', height: '300px' }}>
      <ReactDragonBones
        parent="container"
        url='./dragon.zip'
        width={300}
        height={300}
        armature='Dragon'
        movement='walk'
        isPlay={true}
        offsetX={150}
        offsetY={150}
      />
    </div>
  )
}
```

