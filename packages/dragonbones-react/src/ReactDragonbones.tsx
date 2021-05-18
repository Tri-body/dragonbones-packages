import * as React from 'react'
import * as PropTypes from 'prop-types'
import { DBPlayer } from './DBPlayer'
import { IProps } from './IProps'

export class ReactDragonBones extends React.PureComponent<IProps> {

  private _player: DBPlayer

  static displayName = 'ReactDragonBones'

  static propTypes = {
    url: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired
  }

  componentDidMount() {
    this._player = new DBPlayer(this.props)
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.destroy()
      this._player = null
    }
  }

  componentDidUpdate() {
    if (this._player) {
      this._player.update(this.props)
    }
  }

  render() {
    return null
  }
}
