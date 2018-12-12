const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.scan = function (table) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table
    }

    dynamoDb.scan(params, (error, result) => {
      if (error) reject(error)
      else resolve(result['Items'])
    })
  })
}

module.exports.get = function (table, key) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: key
    }

    dynamoDb.get(params, (error, result) => {
      if (error) reject(error)
      else resolve(result['Item'])
    })
  })
}

module.exports.put = function (table, data) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Item: data
    }

    dynamoDb.put(params, (error) => {
      if (error) reject(error)
      else resolve(params['Item'])
    })
  })
}

module.exports.query = function (table, exp, values) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      KeyConditionExpression: exp,
      ExpressionAttributeValues: values
    }

    dynamoDb.query(params, (error, result) => {
      if (error) reject(error)
      else resolve(result['Items'])
    })
  })
}

module.exports.update = function (table, key, exp, values) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
      Key: key,
      UpdateExpression: exp,
      ExpressionAttributeValues: values,
      ReturnValues: 'UPDATED_NEW'
    }

    dynamoDb.update(params, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}
