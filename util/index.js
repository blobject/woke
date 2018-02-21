import {prod} from '_webpackconfig'

const prefix = (path) => (prod ? '/dev/woke' : '').concat(path)

export {
  prefix
}
