type PreviewState = import('../../shared/src/PreviewState').PreviewState

interface VSCodeApi {
  getState(): PreviewState
  setState(state: PreviewState): void
  postMessage(message: any): void
}

declare function acquireVsCodeApi(): VSCodeApi

interface Window {
  acquireVsCodeApi: () => VSCodeApi
  Vue: import('vue')
  __VUE_HMR_RUNTIME__: import('vue').HMRRuntime
  __UNUSED_NAMESPACE__: any
}

declare const DEVELOPMENT: boolean
