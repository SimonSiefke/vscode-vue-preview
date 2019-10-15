import * as api from './template'
import * as style from './style'
const vscode = acquireVsCodeApi()

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

window.addEventListener('message', event => {
  const { command, payload } = JSON.parse(event.data)
  if (command === 'update') {
    const { component } = payload

    let newComponent = {
      render: new Function(component.render),
    }
    if (component.script !== undefined) {
      newComponent = { ...newComponent, ...eval(component.script) }
    }
    console.log(newComponent)
    api.reload(newComponent)
    // api.rerender(newComponent)
    if (component.style !== undefined) {
      style.update(component.style)
    }
    if (component.previewProps) {
      api.reloadProps(component.previewProps)
    }
  }
})
