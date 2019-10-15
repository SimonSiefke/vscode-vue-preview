import { RemotePlugin } from '../remotePluginApi'

export const remotePluginRender: RemotePlugin = api => {
  api.messageChannel.onMessage('updateRender', payload => {
    api.component.render = new Function(payload.render)
    api.component.scheduleRerender()
  })
}
