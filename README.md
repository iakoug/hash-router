# Hash router

支持常规跳转，路由拦截，路由参数持久化

# 📦 Release package

```bash
npm login

# publish
npm run deploy
```

# 🔧 Usage

#### Install

```bash
npm i @justwink/crisp --save
```

#### Init

```js
import Router from '@justwink/crisp'

const router = new Router()
```

#### Navigate

```js
router.push('#/page')
router.push({path: '#/page'})
router.replace('#/page')
router.replace({path: '#/page'})
router.go(2)
router.back()

// 默认始终携带初始化时配置的持久化参数，使用 needPersistentParams=false 取消携带
router.push({
  path: 'https://www.baidu.com',
  needPersistentParams: false,
})

// 强制跳转外部页面避免被react-router重定向
router.push({
  path: 'https://www.baidu.com',
  force: true,
  // 是否携带持久化页面到外部
  needPersistentParams: false,
})

// 携带参数
router.push({
  path: '#/page',
  query: {
    name: 'justwink',
    gender: 'male',
  },
})
```

#### Page infos

```js
const page = router.page
// from: "#/page"
// query: "?name=12331&age=eeeeee"
// to: "#/pageB"
```

#### Persistent params

###### Init persistent params

```js
// 初始化持久化参数
new bankerRouter({
  persistentParamsList: ['a', 'b', 'c'],
})
```

###### Use persistent params

```js
// Get
const {param} = router.getCurrentParams()
// Or
const param = router.getCurrentParams('param')

// Set
router.setPersistentOption({k: 'v'})

// Delete
router.deletePersistentKey('k')

// Clear
router.removePersistentOption()
```

#### Interceptor

_分为前置和后置_

```js
new bankerRouter({
  // 前置
  beforeEnter(config: any, next: Function) {
    // Your business

    next()
  },
  // 后置
  afterEach() {
    // your business
  },
}),
```

#### Plugin mode

```js
import Router from '@justwink/crisp'

Router.use(instance => {
  instance.bark = () => console.log('Make some noise')
})

const crisp = new Router()

crisp.bark() // Make some noise
```

# 😈 Extra

- 路由跳转根据`/(._#\/[^\?]+)(\??.+)?/`匹配
- `push`、`replace` 方法会触发拦截器
