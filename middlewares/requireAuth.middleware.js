const logger = require('../services/logger.service')
const authService = require('../api/auth/auth.service')

async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  next()
}



// module.exports = requireAuth

module.exports = {
  requireAuth,
}
