import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST'
}

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(withCorsSupport())
}

export const withCorsSupport = () => {
  return {
    before: async (request) => {
      if (request.event.httpMethod === 'OPTIONS') {
        return {
          statusCode: 204,
          headers: CORS_HEADERS,
          body: ''
        }
      }
    },
    after: async (request) => {
      if (!request.response) {
        request.response = {}
      }
      request.response.headers = {
        ...request.response.headers,
        ...CORS_HEADERS
      }
    },
    onError: async (request) => {
      request.response = {
        ...request.response,
        headers: {
          ...request.response?.headers,
          ...CORS_HEADERS
        }
      }
    }
  }
}

export const withAuthValidation = () => {
  return {
    before: async (handler) => {
      if (handler.event.httpMethod === 'OPTIONS') return
      
      const token = handler.event.headers?.authorization
      if (!token) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'No authorization token provided' })
        }
      }
    }
  }
}