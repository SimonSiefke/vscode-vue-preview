import * as api from './template'
import { RemotePluginApi } from './plugins/remotePluginApi'
const vscode = acquireVsCodeApi()
import { remotePluginStyle } from './plugins/remote-plugin-style/remotePluginStyle'
import { remotePluginRender } from './plugins/remote-plugin-render/remotePluginRender'
import { remotePluginScript } from './plugins/remote-plugin-script/remotePluginScript'
import { remotePluginProps } from './plugins/remote-plugin-props/remotePluginProps'
// const Component = {
//   data() {
//     return {
//       count: 0,
//     }
//   },
//   created() {
//     console.log('created')
//   },
//   render(h) {
//     return h(
//       'button',
//       {
//         on: {
//           click: () => {
//             this.count++
//           },
//         },
//       },
//       this.count
//     )
//   },
// }

// const newComponent = {
//   created() {
//     console.log('created')
//   },
//   render(h) {
//     return h(
//       'button',
//       {
//         on: {
//           click: () => {
//             this.count++
//           },
//         },
//       },
//       this.count
//     )
//   },
//   data() {
//     return {
//       count: 10,
//     }
//   },
// }

// api.reload(Component)

const messageChannel = (() => {
  const listeners: { [command: string]: any[] } = {}
  return {
    onMessage: (command: string, listener: (payload: any) => void) => {
      listeners[command] = listeners[command] || []
      listeners[command].push(listener)
    },
    broadcastMessage: (command: string, payload: any) => {
      if (!listeners[command]) {
        // should not happen
        return
      }
      for (const listener of listeners[command]) {
        listener(payload)
      }
    },
  }
})()

// const component = (() => {
//   let newComponent:any
//   return {
//     set script(value){
//       if(!newComponent){}
//     },
//     set render(value){},
//     scheduleRerender: () => {},
//     scheduleReload: () => {},
//   }
// })()

// const remotePluginApi: RemotePluginApi = {
//   messageChannel,
//   component,
// }

window.onmessage = ({ data }) => {
  const messages = JSON.parse(data)
  for (const message of messages) {
    const { command, payload } = message
    if (command in listeners) {
      listeners[command].forEach(listener => listener(payload))
    } else {
      // TODO
      console.log(listeners)
    }
  }
}

const listeners: { [key: string]: Array<(payload: any) => void> } = {}

let componentScript
let componentRender
let componentProps

let componentRenderDirty = false
let componentScriptDirty = false
let componentPropsDirty = false

let animationFrame: number | undefined

let newComponent
const update = () => {
  try {
    console.log(componentRender)
    console.log(componentScript)
    const newComponentRender = new Function(componentRender)
    const newComponentScript = eval(componentScript)

    newComponent = {
      render: newComponentRender,
      ...newComponentScript,
    }
    if (componentScriptDirty) {
      api.reload(newComponent)
      componentScriptDirty = false
      componentRenderDirty = false
    } else if (componentRenderDirty) {
      if (api.hasError()) {
        api.reload(newComponent)
        componentRenderDirty = false
      } else {
        console.log('only render')
        api.rerender(newComponent)
        componentRenderDirty = false
      }
    }
    if (componentPropsDirty) {
      console.log('reload props')
      api.reloadProps(componentProps)
    }
  } catch (error) {
    console.warn(error)
    componentScriptDirty = true
    componentRenderDirty = true
  } finally {
    componentPropsDirty = false
    animationFrame = undefined
  }
}

const scheduleUpdate = () => {
  if (animationFrame === undefined) {
    animationFrame = requestAnimationFrame(update)
  }
}

const remotePluginApi: RemotePluginApi = {
  component: {
    setRender: render => {
      console.log('set render')
      if (componentRender === render) {
        console.log('same')
        return
      }
      componentRender = render
      componentRenderDirty = true
      scheduleUpdate()
    },
    setScript: script => {
      console.log('set script')
      if (componentScript === script) {
        console.log('same')
        return
      }
      componentScript = script
      componentScriptDirty = true
      scheduleUpdate()
    },
    setProps: props => {
      // TODO lodash equals (or better: compare inside extension)
      if (JSON.stringify(componentProps) === JSON.stringify(props)) {
        return
      }
      componentProps = props
      componentPropsDirty = true
      scheduleUpdate()
    },
  },
  messageChannel: {
    onMessage: (command, listener) => {
      if (!listeners[command]) {
        listeners[command] = []
      }
      listeners[command].push(listener)
    },
    // broadcastMessage: (command, payload) => {},
  },
}
remotePluginStyle(remotePluginApi)
remotePluginRender(remotePluginApi)
remotePluginScript(remotePluginApi)
remotePluginProps(remotePluginApi)

// if (command === 'update') {
//   const { component } = payload

//   let newComponent = {
//     render: new Function(component.render),
//   }
//   if (component.script !== undefined) {
//     newComponent = { ...newComponent, ...eval(component.script) }
//   }
//   console.log(newComponent)
//   api.reload(newComponent)
//   // api.rerender(newComponent)
//   if (component.style !== undefined) {
//     style.update(component.style)
//   }
//   if (component.previewProps) {
//     api.reloadProps(component.previewProps)
//   }
// }
