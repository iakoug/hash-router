import {getCurrentHash, hashCheck, compose, cohesiveQuery, queryParams} from '../helpers'
import {RouterArguments, Page, Options, PersistentPrams} from '../models'

export default class Router {
  page: Page

  private beforeEnter: Function
  private afterEach: Function
  private persistentPrams: PersistentPrams = {}
  private persistentParamsList: string[]

  constructor(options: Options = {}) {
    this.page = {}
    this.afterEach = options.afterEach || function() {}
    this.beforeEnter = options.beforeEnter || ((c, next) => next())
    this.persistentParamsList = options.persistentParamsList || []

    this.initialPersistentParams()
    this.initialPageData()

    window.addEventListener('popstate', this.initialPageData)
  }

  static use = (plugin: Function) => plugin(Router.prototype)

  private hashSettings = (config: RouterArguments) => {
    const {path, query = '', needPersistentParams} = hashCheck(config)
    const persistentParams =
      config.hasOwnProperty('needPersistentParams') && !needPersistentParams
        ? {}
        : this.persistentPrams
    const jointQuery = cohesiveQuery(persistentParams, query)

    return `${path}${jointQuery === '?' ? '' : jointQuery}`
  }

  private initialPersistentParams = () => {
    const params = queryParams()

    if (Object.keys(params).length && this.persistentParamsList.length) {
      this.persistentPrams = this.persistentParamsList.reduce(
        (all, k) => (k in params ? {...all, [k]: params[k]} : all),
        {},
      )
    }
  }

  private initialPageData = () => {
    const to = getCurrentHash()
    const {query} = hashCheck(window.location.href)
    const {to: from = to} = this.page

    this.page = {...this.page, from, to, query: query as string}
  }

  private $push = (config: RouterArguments, next: Function) => {
    window.location.href = this.hashSettings(config)

    next()
  }

  private $replace = (config: RouterArguments, next: Function) => {
    window.location.replace(this.hashSettings(config))

    next()
  }

  private $compose = (navigateMiddleware: Function) =>
    compose(this.beforeEnter, navigateMiddleware, this.afterEach)

  getCurrentParams = (k?: string) => (k ? this.persistentPrams[k] : {...this.persistentPrams})
  deletePersistentOption = (k: string) => delete this.persistentPrams[k]
  removePersistentOption = () => (this.persistentPrams = {})
  setPersistentOption = (option: PersistentPrams) =>
    (this.persistentPrams = {
      ...this.persistentPrams,
      ...option,
    })

  push = (config: RouterArguments) => this.$compose(this.$push)(config)
  replace = (config: RouterArguments) => this.$compose(this.$replace)(config)
  back = () => window.history.back()
  go = (delta: number) => window.history.go(delta)
}
