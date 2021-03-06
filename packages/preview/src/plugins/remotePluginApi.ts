export interface RemotePluginApi {
  messageChannel: {
    onMessage: (command: string, listener: (payload: any) => void) => void
    // broadcastMessage: (command: string, payload: any) => void
  }
  component: {
    setRender: Function
    setScript: Function
    setProps: Function
  }
}

export type RemotePlugin = (api: RemotePluginApi) => void
