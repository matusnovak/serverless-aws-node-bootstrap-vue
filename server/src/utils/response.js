module.exports.ok = function (body, headers) {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: headers || {}
  }
}

module.exports.notFound = function (message) {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: message })
  }
}

module.exports.badRequest = function (message) {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: message })
  }
}

module.exports.unauthorized = function (message) {
  return {
    statusCode: 401,
    body: JSON.stringify({ message: message })
  }
}

module.exports.forbidden = function (message) {
  return {
    statusCode: 403,
    body: JSON.stringify({ message: message })
  }
}
