// utils/index.js

const runMiddleware = (req, res, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

module.exports = { runMiddleware }