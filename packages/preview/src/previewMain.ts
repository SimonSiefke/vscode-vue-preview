import * as Vue from 'vue'
import { ComponentOptions, RenderFunction } from 'vue'
import { Message, MessageTypes } from './MessageTypes'
import * as vueHmrApi from './vueHmrApi'

// TODO full reload if there is an error

window.Vue = Vue

const vscode = acquireVsCodeApi()
const $style = document.getElementById('style') as HTMLStyleElement

interface State {
  error: string | undefined
}

const state: State = {
  error: undefined,
}

const updateComponent = ({
  newComponentProps,
  newComponentRender,
  newComponentScript,
  newComponentStyle,
}: {
  newComponentProps: string | undefined
  newComponentRender: string | undefined
  newComponentScript: string | undefined
  newComponentStyle: string | undefined
}) => {
  let needsFullReload = !!state.error
  let needsRerender = false
  let newComponent: ComponentOptions = {}
  // PROPS
  if (newComponentProps) {
    const processedNewComponentProps = JSON.parse(newComponentProps)
    vueHmrApi.updateProps(processedNewComponentProps)
  }
  // RENDER
  if (newComponentRender) {
    let processedNewComponentRender: ComponentOptions['render']
    const importsMatch = newComponentRender.match(/import (.*)? from "vue"/) as RegExpMatchArray
    console.log(newComponentRender)
    console.log(']]]]]]]]]]]')
    const rest = newComponentRender.slice(importsMatch[0].length)
    const restWithLocalRenderFunction = rest.replace(
      'export function render',
      'processedNewComponentRender = function render'
    )
    // console.log(rest)
    // console.log('[[[[[[')
    // const renderFunctionContent = rest.slice(
    //   '\n\nexport function render() {\n'.length,
    //   -'}\n'.length
    // )
    // console.log(renderFunctionContent)
    const globalVueDestructuring = `const ${importsMatch[1]} = window.Vue`
    eval(globalVueDestructuring)
    eval(restWithLocalRenderFunction)
    newComponent = { ...newComponent, render: processedNewComponentRender }
    lastProcessedComponentRender = processedNewComponentRender
    needsRerender = true
  } else if (lastProcessedComponentRender) {
    newComponent = { ...newComponent, render: lastProcessedComponentRender }
  }
  // SCRIPT
  if (newComponentScript) {
    let scriptExport = newComponentScript.slice(
      newComponentScript.indexOf('export default') + 'export default'.length
    )
    if (!scriptExport.endsWith('}')) {
      scriptExport = scriptExport.slice(0, scriptExport.lastIndexOf('}') + 1)
    }
    let processedNewComponentScript: ComponentOptions = {}
    eval(`processedNewComponentScript=${scriptExport}`)
    newComponent = { ...newComponent, ...processedNewComponentScript }
    lastProcessedComponentScript = processedNewComponentScript
    needsFullReload = true
  } else if (lastProcessedComponentScript) {
    newComponent = { ...newComponent, ...lastProcessedComponentScript }
  }
  // STYLE
  if (newComponentStyle) {
    $style.innerText = newComponentStyle
  }
  // PERFORM UPDATE
  if (needsFullReload) {
    console.log('reload')
    if (state.error) {
      state.error = undefined
    }
    vueHmrApi.reload(newComponent)
  } else if (needsRerender) {
    console.log('rerender')
    vueHmrApi.rerender(newComponent.render as RenderFunction)
  }
}

let newComponentProps: MessageTypes.UpdateProps['payload']['props'] | undefined
let newComponentRender: MessageTypes.UpdateRender['payload']['render'] | undefined
let newComponentScript: MessageTypes.UpdateScript['payload']['script'] | undefined
let newComponentStyle: MessageTypes.UpdateStyle['payload']['style'] | undefined

let lastComponentProps: MessageTypes.UpdateProps['payload']['props'] | undefined
let lastComponentRender: MessageTypes.UpdateRender['payload']['render'] | undefined
let lastComponentScript: MessageTypes.UpdateScript['payload']['script'] | undefined
let lastComponentStyle: MessageTypes.UpdateStyle['payload']['style'] | undefined

let lastProcessedComponentProps: object | undefined
let lastProcessedComponentRender: NonNullable<ComponentOptions['render']> | undefined
let lastProcessedComponentScript: ComponentOptions | undefined

const throttle: (fn: () => void) => () => void = fn => {
  let ticking = false
  return () => {
    if (ticking) {
      return
    }
    ticking = true
    requestAnimationFrame(() => {
      fn()
      ticking = false
    })
  }
}

const scheduleUpdateComponent = throttle(() => {
  try {
    updateComponent({
      newComponentProps,
      newComponentRender,
      newComponentScript,
      newComponentStyle,
    })
  } catch (error) {
    console.warn('[VUE_HMR_ERROR]', error)
    state.error = 'update error'
    vscode.postMessage({
      type: 'setError',
      payload: state.error,
    })
  }
  newComponentProps = undefined
  newComponentRender = undefined
  newComponentScript = undefined
  newComponentStyle = undefined
})

window.onmessage = ({ data }: { data: string }) => {
  const messages = JSON.parse(data) as Message[]
  for (const message of messages) {
    switch (message.type) {
      case 'updateProps':
        if (message.payload.props !== lastComponentProps) {
          newComponentProps = message.payload.props
          lastComponentProps = message.payload.props
        }
        continue
      case 'updateRender':
        if (message.payload.render !== lastComponentRender) {
          newComponentRender = message.payload.render
          lastComponentRender = message.payload.render
        }
        continue
      case 'updateScript':
        if (message.payload.script !== lastComponentScript) {
          newComponentScript = message.payload.script
          lastComponentScript = message.payload.script
        }
        continue
      case 'updateStyle':
        if (message.payload.style !== lastComponentStyle) {
          newComponentStyle = message.payload.style
          lastComponentStyle = message.payload.style
        }
        continue
    }
  }
  scheduleUpdateComponent()
}

// const listeners: { [key: string]: Array<(payload: any) => void> } = {}

// let stringComponentScript
// let stringComponentRender
// let componentProps

// let componentRenderDirty = false
// let componentScriptDirty = false
// let componentPropsDirty = false

// let animationFrame: number | undefined

// let newComponent
// const update = () => {
//   try {
//     // console.log(componentRender)
//     // console.log(componentScript)
//     // console.log(openBlock)
//     // let newComponentRender =
//     // eval(`function newComponentRender(){}`)
//     let newComponentRender
//     eval(`newComponentRender = function(){${stringComponentRender}}`)
//     const newComponentScript = eval(stringComponentScript)
//     newComponent = {
//       render: newComponentRender,
//       ...newComponentScript,
//     }
//     if (componentScriptDirty) {
//       api.reload(newComponent)
//       componentScriptDirty = false
//       componentRenderDirty = false
//     } else if (componentRenderDirty) {
//       // if (api.hasError()) {
//       //   api.reload(newComponent)
//       //   componentRenderDirty = false
//       // } else
//       {
//         console.log('only render')
//         api.rerender(newComponent)
//         componentRenderDirty = false
//       }
//     }
//     if (componentPropsDirty) {
//       console.log('reload props')
//       // api.reloadProps(componentProps)
//     }
//   } catch (error) {
//     console.warn(error)
//     componentScriptDirty = true
//     componentRenderDirty = true
//   } finally {
//     componentPropsDirty = false
//     animationFrame = undefined
//   }
// }

// const scheduleUpdate = () => {
//   if (animationFrame === undefined) {
//     animationFrame = requestAnimationFrame(update)
//   }
// }

// const remotePluginApi: RemotePluginApi = {
//   component: {
//     setRender: render => {
//       console.log('set render')
//       if (stringComponentRender === render) {
//         console.log('same')
//         return
//       }
//       stringComponentRender = render
//       componentRenderDirty = true
//       scheduleUpdate()
//     },
//     setScript: script => {
//       console.log('set script')
//       if (stringComponentScript === script) {
//         console.log('same')
//         return
//       }
//       stringComponentScript = script
//       componentScriptDirty = true
//       scheduleUpdate()
//     },
//     setProps: props => {
//       // TODO lodash equals (or better: compare inside extension)
//       if (JSON.stringify(componentProps) === JSON.stringify(props)) {
//         return
//       }
//       componentProps = props
//       componentPropsDirty = true
//       scheduleUpdate()
//     },
//   },
//   messageChannel: {
//     onMessage: (command, listener) => {
//       if (!listeners[command]) {
//         listeners[command] = []
//       }
//       listeners[command].push(listener)
//     },
//     // broadcastMessage: (command, payload) => {},
//   },
// }
// // remotePluginStyle(remotePluginApi)
// // remotePluginRender(remotePluginApi)
// // // remotePluginScript(remotePluginApi)
// // // remotePluginProps(remotePluginApi)
// // // remotePluginStaticRenderFns(remotePluginApi)

// remotePluginApi.component.setScript(function() {
//   const _ctx = this
//   return openBlock(), createBlock('h1', null, 'hello world')
// })
