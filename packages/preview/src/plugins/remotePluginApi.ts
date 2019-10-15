export interface RemotePluginApi {
  messageChannel: {
    onMessage: (command: string, listener: (payload: any) => void) => void
    broadcastMessage: (command: string, payload: any) => void
  }
  component: {
    script?: object
    render?: Function
    scheduleReload: () => void
    scheduleRerender: () => void
  }
}

export type RemotePlugin = (api: RemotePluginApi) => void
