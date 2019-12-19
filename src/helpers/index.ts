import {RouterArguments} from '../models'

// hash & query
const hashReg = /(.*#\/[^\?]+)(\??.+)?/
const hashSnippetReg = /.*(#\/[A-Z a-z]+)/

/**
 * 序列化json为query
 * @param {object} obj
 * @example
 * stringifyQuery({a:1, b: 22, person: {age: 18, name: 'ls'}})
 * @returns "?a=1&b=22&person={"age":18,"name":"ls"}"
 */
export function serializeQuery(obj, needQuestionMark = true, needEncode = true) {
  const keys = Object.keys(obj)

  return keys.length
    ? `${needQuestionMark ? '?' : ''}${keys
        .map(key => {
          let val = obj[key]

          if (val && [Array, Object].includes(val.constructor)) {
            val = JSON.stringify(val)
          }

          return ![undefined].includes(val)
            ? `${key}=${needEncode ? encodeURIComponent(val) : val}`
            : key
        })
        .filter(Boolean)
        .join('&')}`
    : needQuestionMark
    ? '?'
    : ''
}

/*
 * 获取URL参数
 * @param {String} key
 * @return {String}
 **/
export function queryParam(key, href) {
  return queryParams(href)[key] || ''
}

/*
 * 获取URL参数列表对象
 *
 **/
export function queryParams(href = location.href) {
  const q = {}
  const myReg = /[?&]+([^?=&#]+)=?([^?&#]+)?/g
  const url = href || window.location.href
  let myArray
  while ((myArray = myReg.exec(url)) !== null) {
    q[myArray[1]] = myArray[0].includes('=') ? myArray[2] || '' : true
  }
  return q
}

export const cohesiveQuery = (...args) =>
  serializeQuery(
    args.reduce(
      (map, c) => ({
        ...map,
        ...(typeof c === 'string' ? queryParams(`?${c}`) : c),
      }),
      {},
    ),
    true,
    false,
  )

export const getCurrentHash = (href = window.location.href) => {
  const hashList = hashSnippetReg.exec(href)

  return (hashList && hashList[1]) || '/'
}

export const hashCheck = (configure: RouterArguments = '') => {
  let config: RouterArguments = configure

  // sting
  if (typeof config === 'string') {
    const [, matchPath = '', matchQuery = ''] = hashReg.exec(config) || []

    config = {path: matchPath, query: queryParams(`?${matchQuery}`)}
  }

  const {path, query, force} = config

  if (force) return config

  const [, hashPath = '', pathQuery = ''] = hashReg.exec(path) || []

  return {
    ...config,
    query: cohesiveQuery(query, pathQuery),
    path: hashPath,
  }
}

export const compose = (...middlewares) => (...args) =>
  (function dispatch(order = 0) {
    return !middlewares[order]
      ? TypeError('Useless router middleware, plz check it out.')
      : middlewares[order](...args, () => dispatch(order + 1))
  })()
