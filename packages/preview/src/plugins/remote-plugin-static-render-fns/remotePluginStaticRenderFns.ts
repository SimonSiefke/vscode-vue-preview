import { RemotePlugin } from '../remotePluginApi';

export const remotePluginStaticRenderFns:RemotePlugin=api=>{
  api.messageChannel.onMessage(
    'updateStaticRenderFns', payload=>{
      api.component.setStaticRenderFns(payload.staticRenderFns)
    }
  )
}