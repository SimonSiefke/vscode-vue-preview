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
    api.rerender(newComponent)
    if (component.style !== undefined) {
      style.update(component.style)
    }
  }
})
