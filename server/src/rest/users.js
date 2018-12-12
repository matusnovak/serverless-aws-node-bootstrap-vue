const { ok, badRequest, unauthorized } = require('../utils/response')
const db = require('../utils/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const TOKEN_EXP_SECONDS = 60 * 60 * 24 * 365

// Policy helper function
// Source: https://github.com/serverless/examples/blob/master/aws-node-auth0-custom-authorizers-api/handler.js
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

const sign = (user) => {
  const payload = {
    id: user.id
  }
  const options = {
    expiresIn: TOKEN_EXP_SECONDS
  }
  const token = jwt.sign(payload, process.env.AUTH_SECRET, options)

  return token
}

exports.auth = function (event, context, callback) {
  // Get authentication token
  const parts = event.authorizationToken.split(' ')
  if (parts[0].toLowerCase() !== 'bearer' || !parts[1]) return callback('Unauthorized')
  const token = parts[1]

  // Verify JWT
  try {
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) {
        console.warn('Invalid token', err)
        return callback('Unauthorized')
      }

      // Source: https://medium.com/asked-io/serverless-custom-authorizer-issues-on-aws-57a40176f63f
      const arn = event.methodArn.split('/').slice(0, 2).join('/') + '/*'
      return callback(null, generatePolicy(decoded.id, 'Allow', arn))
    })
  } catch (err) {
    console.warn('Invalid token', err)
    return callback('Unauthorized')
  }
}

exports.register = async function (event, context) {
  const body = JSON.parse(event.body)
  if (!body.username) return badRequest('Username is required')
  if (!body.password) return badRequest('Password is required')

  const test = await db.get(process.env.DYNAMODB_TABLE_USERS, { id: body.username })
  if (test) return badRequest('This username already exists')

  const data = {
    id: body.username,
    password: bcrypt.hashSync(body.password, 8),
    created: new Date().toISOString()
  }

  const user = await db.put(process.env.DYNAMODB_TABLE_USERS, data)

  const token = sign(user)
  const headers = {
    'Set-Cookie': 'jwt=' + token + '; Path=/; Expires=' + new Date(new Date().getTime() + 1000 * TOKEN_EXP_SECONDS).toUTCString()
  }
  return ok({}, headers)
}

exports.login = async function (event, context) {
  const body = JSON.parse(event.body)
  if (!body.username) return badRequest('Username is required')
  if (!body.password) return badRequest('Password is required')

  const user = await db.get(process.env.DYNAMODB_TABLE_USERS, { id: body.username })
  if (!user) return unauthorized('Invalid username or password')
  if (!bcrypt.compareSync(body.password, user.password)) return unauthorized('Invalid username or password')

  const token = sign(user)
  const headers = {
    'Set-Cookie': 'jwt=' + token + '; Path=/; Expires=' + new Date(new Date().getTime() + 1000 * TOKEN_EXP_SECONDS).toUTCString()
  }
  return ok({}, headers)
}

exports.logout = async function (event, context) {
  const headers = {
    'Set-Cookie': 'jwt=; Path=/; Expires=' + new Date(new Date().getTime())
  }
  return ok({}, headers)
}
