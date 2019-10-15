import { RemotePlugin } from '../remotePluginApi'

const $style = document.getElementById('style') as HTMLStyleElement

export const remotePluginStyle: RemotePlugin = api => {
  api.messageChannel.onMessage('updateStyle', payload => {
    $style.innerText = payload.style
  })
}
