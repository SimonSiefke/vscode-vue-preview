import { RemotePlugin } from '../remotePluginApi'

export const remotePluginProps: RemotePlugin = api => {
  api.messageChannel.onMessage('updateProps', payload => {
    api.component.setProps(payload.props)
  })
}
