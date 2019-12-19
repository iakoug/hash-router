export type Queries =
  | string
  | {
      [index: string]: any
    }

export type RouterArguments =
  | string
  | {
      path: string
      query?: Queries
      force?: boolean
      needPersistentParams?: boolean
    }

export interface Page {
  from?: string
  to?: string
  query?: string
}

export interface Options {
  afterEach?: Function
  beforeEnter?: Function
  persistentParamsList?: string[]
}

export interface PersistentPrams {
  [index: string]: any
}
