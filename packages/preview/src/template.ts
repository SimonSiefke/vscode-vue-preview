import * as api from 'vue-hot-reload-api'

const Vue = window.Vue
console.log(Vue)
api.install(Vue)

const ComponentId = 'component'
let Component

const init = newComponent => {
  api.createRecord(ComponentId, newComponent)
  new Vue({
    el: '#app',
    render: h => h(newComponent),
  })
  Component = newComponent
  return true
}

const notExists = (): boolean => !Component

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
