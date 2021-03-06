import React from 'react'
import { clipboard } from 'electron'
import { connect } from 'react-redux'

import { viewChannel, joinChannel } from '../actions'
import InputPrompt from './InputPrompt'

const mapStateToProps = state => ({
  addr: state.currentMesh,
  mesh: state.meshes[state.currentMesh]
})

const mapDispatchToProps = dispatch => ({
  joinChannel: ({addr, channel}) => dispatch(joinChannel({addr, channel})),
  viewChannel: ({addr, channel}) => dispatch(viewChannel({addr, channel}))
})

class SidebarScreen extends React.Component {

  joinChannel (channel) {
    var addr = this.props.addr
    this.props.joinChannel({addr, channel})
  }

  copyClick () {
    clipboard.writeText('dat://' + this.props.addr)
    alert('Copied dat:// link to clipboard! Now you can give it to people you want to join your MESH. Only people with the link can join.')
  }

  selectChannel (channel) {
    var addr = this.props.addr
    this.props.viewChannel({addr, channel})
  }

  render () {
    var self = this
    const { mesh } = this.props

    var userKeys = Object.keys(mesh.users)
    var channelKeys = Object.keys(mesh.channels)

    return (<div className='sidebar'>
      <div className='copy-link'>
        <button onClick={self.copyClick.bind(self)}>Copy Dat Link</button>
      </div>
      <div className='add-channel'>
        <InputPrompt
          placeholder='Channel name'
          prompt='+ Join Channel'
          onSubmit={self.joinChannel.bind(self)} />
      </div>
      <div className='sidebar-scroll'>
        <div className='channels'>
          <div className='heading'>Channels</div>
          <ul>
            {
              channelKeys.map((channel) =>
                <li className={mesh.channel === channel ? 'active' : ''}>
                  <button onClick={this.selectChannel.bind(this, channel)}>
                    {channel}
                  </button>
                </li>
              )
            }
          </ul>
        </div>
        <div className='channels'>
          <div className='heading'>Users</div>
          <ul>
            {userKeys.map((username) =>
              (username !== mesh.username) && <li> {username}</li>
            )}
          </ul>
          <ul className='status'>
            <li className='username'>
              {mesh.username}
            </li>
          </ul>
        </div>
      </div>
    </div>
    )
  }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarScreen)

export default Sidebar
