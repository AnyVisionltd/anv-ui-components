const isProduction = process.env.NODE_ENV === 'production'


/* eslint-disable no-console */
const print = type => {
  if (!isProduction) {
    //build-disable-next-line
    return (...params) => params.forEach(param => console[type](param))
  }
  return (...params) => {}
}
/* eslint-enable no-console */

export default {
  log: print('log'),
  error: print('error'),
  warn: print('warn'),
  debug: print('debug')
}
