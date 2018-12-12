const { ok, notFound, badRequest, unauthorized } = require('../utils/response')
const db = require('../utils/db')
const uuid = require('uuid')

exports.list = async function (event, context) {
  const postId = event.pathParameters.postId
  const comments = await db.query(process.env.DYNAMODB_TABLE_COMMENTS, 'postid = :postid', { ':postid': postId })
  return ok(comments)
}

exports.create = async function (event, context) {
  console.log('event', event)
  const username = event.requestContext.authorizer.principalId
  const postId = event.pathParameters.postId
  const body = JSON.parse(event.body)
  if (!body.text) return badRequest('Text is required')
  if (!username) return unauthorized('You are not logged in')

  const post = await db.get(process.env.DYNAMODB_TABLE_POSTS, { id: postId })
  if (!post) return notFound('Post not found')

  const data = {
    id: uuid.v1(),
    postid: postId,
    text: body.text,
    author: username,
    created: new Date().toISOString()
  }

  const comment = await db.put(process.env.DYNAMODB_TABLE_COMMENTS, data)

  // Update the number of comments
  const result = await db.update(process.env.DYNAMODB_TABLE_POSTS, { id: postId },
    'set comments = :comments', { ':comments': parseInt(post.comments) + 1 })

  console.log('result', result)
  return ok(comment)
}
