// import {Router} from '../lib'
// import {queryParams} from '@jsUtil'

// // 路由跳转持久化参数
// let persistentPrams = {}

// const queryList = ['mcId', 'customerFxId'] // mcId和上级分销ID(记录上下级关系)
// const params = queryParams()

// if (Object.keys(params).length) {
//   persistentPrams = queryList.reduce((all, k) => (k in params ? {...all, [k]: params[k]} : all), {})
// }

// function __defineGetter__(k: string, fn: Function) {
//   Router.use(Router =>
//     Object.defineProperty(Router.prototype, k, {
//       get() {
//         return fn
//       },
//     }),
//   )
// }

// __defineGetter__('getCurrentParams', (k: string) => (k ? persistentPrams[k] : {...persistentPrams}))
// __defineGetter__(
//   'setPersistentOption',
//   (option: {[index: string]: any}) =>
//     (persistentPrams = {
//       ...persistentPrams,
//       ...option,
//     }),
// )
