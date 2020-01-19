export namespace MessageTypes {
  export type UpdateStyle = {
    readonly type: 'updateStyle'
    readonly payload: {
      readonly style: string
    }
  }
  export type UpdateRender = {
    readonly type: 'updateRender'
    readonly payload: {
      readonly render: string
    }
  }
  export type UpdateScript = {
    readonly type: 'updateScript'
    readonly payload: {
      readonly script: string
    }
  }
  export type UpdateProps = {
    readonly type: 'updateProps'
    readonly payload: {
      readonly props: string
    }
  }
}

export type Message =
  | MessageTypes.UpdateStyle
  | MessageTypes.UpdateProps
  | MessageTypes.UpdateScript
  | MessageTypes.UpdateRender
