import { RemotePlugin } from '../remotePluginApi'

export const remotePluginScript: RemotePlugin = api => {
  api.messageChannel.onMessage('updateScript', payload => {
    api.component.script = eval(payload.script)
    api.component.scheduleReload()
  })
}
