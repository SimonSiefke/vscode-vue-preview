import { RemotePlugin } from '../remotePluginApi'

export const remotePluginScript: RemotePlugin = api => {
  api.messageChannel.onMessage('updateScript', payload => {
    api.component.setScript(payload.script)
  })
}
