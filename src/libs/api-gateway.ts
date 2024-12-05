import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

export const formatErrorResponse = (statusCode: number, message: string) => {
    return {
        statusCode,
        body: JSON.stringify({ error: message })
    };
};

export const badRequestResponse = (message: string) => {
    return formatErrorResponse(400, message);
}

export const internalServerErrorResponse = (message: string) => {
    return formatErrorResponse(500, message);
}

export const notFoundResponse = (message: string) => {
    return formatErrorResponse(404, message);
}

export const unauthorizedResponse = (message: string) => {
    return formatErrorResponse(401, message);
}