import * as api from 'vue-hot-reload-api'

const Vue = window.Vue
console.log(Vue)
api.install(Vue)

const ComponentId = 'component'
let Component
let RootComponent

const init = newComponent => {
  api.createRecord(ComponentId, newComponent)
  RootComponent = new Vue({
    el: '#app',
    data() {
      return {
        props: {
          message: 'world',
        },
      }
    },
    render(h) {
      return h(newComponent, {
        props: this.props,
      })
    },
  })
  Component = newComponent
  return true
}

const notExists: () => boolean = () => !Component

export const reloadProps = newProps => {
  RootComponent.props = JSON.parse(newProps)
}

// setTimeout(() => {
//   reloadProps({
//     message: 'world 2',
//   })
// }, 2000)

/**
 * updates the component and its state
 * @param newComponent
 */
export const reload = newComponent => {
  if (notExists()) {
    init(newComponent)
    return
  }
  api.reload(ComponentId, newComponent)
  Component = newComponent
}

/**
 * updates the component but not its state
 * @param newComponent
 */
export const rerender = newComponent => {
  if (notExists()) {
    init(newComponent)
    return
  }
  api.rerender(ComponentId, newComponent)
  Component = newComponent
}
