import { _UserFriendlyError } from "@functions/_shared/errors/userFriendly/_UserFriendlyError"
import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import validator from "@middy/validator"
import { transpileSchema } from '@middy/validator/transpile'
/**
 * Custom error handler for the lambda function
 * 
 * @returns 
 */
const customErrorHandler = () => ({
	onError: async (request) => {
		// User friendly error
		if (request.error instanceof _UserFriendlyError) {
			const response = {
				statusCode: request.error.httpCode,
				body: JSON.stringify({
					message: request.error.message
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}
			return response
		}

		// Validation schema error
		if (request.error.message?.includes('Event object failed validation')) {
			console.log(request.error);
			const response = {
				statusCode: 400,
				body: JSON.stringify({
					message: 'The request body is invalid, check the mandatory fields or fields types'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}
			return response
		}

		// Internal server error
		console.log(request.error);
		const response = {
			statusCode: 500,
			body: JSON.stringify({ message: 'An error occurred while processing the request' }),
			headers: {
				'Content-Type': 'application/json'
			}
		}
		return response
	}
})

/**
 * Middleware for the lambda function
 * 
 * @param handler 
 * @returns 
 */
export const middyfy = (handler) => {
	return middy(handler)
		.use(middyJsonBodyParser())
		.use(validator({
			eventSchema: transpileSchema({
				type: "object",
				properties: {
					body: handler.schema
				}
			})
		}))
		.use(customErrorHandler())
}