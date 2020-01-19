import {
  ComponentOptions,
  createApp,
  createBlock,
  openBlock,
  ref,
  RenderFunction,
  createVNode,
  defineComponent,
} from 'vue'

const api = window.__VUE_HMR_RUNTIME__

const __hmrId = 'component'

let Component: ComponentOptions = {
  __hmrId,
}

const props = ref({})

const RootComponent = {
  components: { Component },
  setup() {
    return {
      props,
    }
  },
  render() {
    const _ctx = this
    return (
      openBlock(), createBlock(Component, _ctx.props, null, 8 /* PROPS */, Object.keys(_ctx.props))
    )
  },
}

api.createRecord(__hmrId, Component)

createApp().mount(RootComponent, '#app')

/**
 * Updates the component and its state
 * @param newComponent
 */
export const reload = (newComponent: ComponentOptions) => {
  newComponent.__hmrId = __hmrId
  api.reload(__hmrId, newComponent)
}

/**
 * Updates the component but not its state
 * @param newRender
 */
export const rerender = (newRender: RenderFunction) => {
  api.rerender(__hmrId, newRender)
}

/**
 * Updates the props of the component
 * @param newProps
 */
export const updateProps = (newProps: object) => {
  props.value = newProps
}
