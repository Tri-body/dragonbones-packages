import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { ReactDragonBones } from '@gnoijli/dragonbones-react'

function App(props) {
  const [play, setPlay] = useState(true)

  return (
    <div id="container" style={{ width: '300px', height: '300px' }}>
      <ReactDragonBones
        parent="container"
        url='./dragon.zip'
        width={300}
        height={300}
        armature='Dragon'
        movement='walk'
        isPlay={play}
        offsetX={150}
        offsetY={150}
      />
      <button onClick={() => setPlay(!play)} >{play ? '停止' : '播放'}</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))