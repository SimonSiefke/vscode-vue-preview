import { RemotePlugin } from '../remotePluginApi'

export const remotePluginRender: RemotePlugin = api => {
  api.messageChannel.onMessage('updateRender', payload => {
    api.component.setRender(payload.render)
  })
}
