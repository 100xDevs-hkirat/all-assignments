const jwt = require('jsonwebtoken')
const SECRET1 = 'Secret29' // This should be in an environment variable in a real application
const SECRET2 = 'Secret17'

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET1, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET2, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}

module.exports = {
  authenticateAdminJwt,
  SECRET1,
  authenticateUserJwt,
  SECRET2,
}
