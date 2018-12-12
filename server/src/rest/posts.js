const { ok, notFound, badRequest, unauthorized } = require('../utils/response')
const db = require('../utils/db')
const uuid = require('uuid')

exports.list = async function (event, context) {
  const posts = await db.scan(process.env.DYNAMODB_TABLE_POSTS)
  return ok(posts)
}

exports.read = async function (event, context) {
  const postId = event.pathParameters.postId
  const post = await db.get(process.env.DYNAMODB_TABLE_POSTS, { id: postId })
  if (!post) return notFound('Post not found')
  return ok(post)
}

exports.create = async function (event, context) {
  const username = event.requestContext.authorizer.principalId
  const body = JSON.parse(event.body)
  if (!body.title) return badRequest('Title is required')
  if (!username) return unauthorized('You are not logged in')

  const data = {
    id: uuid.v1(),
    title: body.title,
    comments: 0,
    author: username,
    created: new Date().toISOString()
  }

  const post = await db.put(process.env.DYNAMODB_TABLE_POSTS, data)
  return ok(post)
}
