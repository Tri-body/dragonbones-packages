import * as React from 'react'
import * as PropTypes from 'prop-types'
import { DBPlayer } from './DBPlayer'
import { IProps } from './IProps'

export class ReactDragonBones extends React.PureComponent<IProps> {

  private _player: DBPlayer

  static displayName = 'ReactDragonBones'

  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  private _ref: HTMLDivElement

  private setRef = (r: HTMLDivElement) => this._ref = r

  componentDidMount() {
    this._player = new DBPlayer(this._ref, this.props)
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
    return (
      <div style={this.props.styles} ref={this.setRef}></div>
    )
  }
}

export default ReactDragonBones
