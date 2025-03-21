import {
    APIGatewayEventDefaultAuthorizerContext,
    APIGatewayEventRequestContextV2,
    APIGatewayEventRequestContextWithAuthorizer,
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEventV2WithJWTAuthorizer,
    APIGatewayProxyEventV2WithLambdaAuthorizer,
    APIGatewayProxyEventV2WithRequestContext,
} from "aws-lambda";
import { decode } from "jsonwebtoken";

import {
    InvocationResponse as AWSInvocationResponse,
    Lambda as AWSLambda,
    InvocationType,
} from "@aws-sdk/client-lambda";

export interface AuthorizedTypedInvokeProps<T> {
    options: ILambdaInvokeOptions;
    jwt: string;
    functionName: string;
    invokeBody: T;
}

export interface AuthorizerContext {
    applicationVersion: any;
    organization: {
        id: string;
        legacyId: string;
    };
    user: {
        api_key: string;
        email: string;
        id: string;
        legacyBasicToken: string;
        legacyId: string;
    };
}

export interface AuthToken {
    email: string;
    scope?: string;
    api_key: string;
    idu: string;
    lang: string;
    org?: string;
    idc: string;
    applicationVersion: any;
    iat?: number;
    exp?: number;
    familyName?: string;
    givenName?: string;
    jti?: string;
    tokenHeader?: string;
}

interface AuthorizerResponse {
    id: string;
    email: string;
    username: string;
}

export interface ILambdaInvokeOptions {
    region: string;
    endpoint?: string;
}

export interface InvocationResponse extends AWSInvocationResponse { }

export type InvocationRequest = {
    payload: string;
};

interface InvokePayload<T> {
    headers?: {
        [key: string]: any;
    };
    body: T;
}

export type LambdaInvokeOrRequestEvent =
    | APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
    | InvocationRequest;

/**
 * Utils used in some lambda utilities
 */
export class Lambda {
    static async invoke(
        options: ILambdaInvokeOptions,
        functionName: string,
        payload?: object | string,
        invocationType?: string | "RequestResponse"
    ): Promise<InvocationResponse> {
        const lambda = new AWSLambda(options);

        if (process.env.AUDIT_TRACE_ID) {
            if (typeof payload !== "string") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                payload["auditTraceId"] = process.env.AUDIT_TRACE_ID;
            } else {
                const jsonPayload = JSON.parse(payload);
                jsonPayload["auditTraceId"] = process.env.AUDIT_TRACE_ID;
                payload = JSON.stringify(jsonPayload);
            }
        }

        return await lambda.invoke({
            FunctionName: functionName,
            Payload: Buffer.from(JSON.stringify({ payload })),
            InvocationType: invocationType as InvocationType,
        });
    }

    static async typedInvoke<T>(
        options: ILambdaInvokeOptions,
        functionName: string,
        payload?: InvokePayload<T>,
        invocationType?: string | "RequestResponse"
    ): Promise<InvocationResponse> {
        const lambda = new AWSLambda(options);
        const parsedPayload = JSON.stringify(payload);

        return await lambda.invoke({
            FunctionName: functionName,
            Payload: Buffer.from(JSON.stringify({ payload: parsedPayload })),
            InvocationType: invocationType as InvocationType,
        });
    }

    static async authorizedTypedInvoke<T>(props: AuthorizedTypedInvokeProps<T>) {
        const { jwt, invokeBody, functionName, options } = props;

        return await this.typedInvoke<T>(options, functionName, {
            headers: { authorization: jwt },
            body: invokeBody,
        });
    }

    /**
     * Convierte cualquier objeto en un string descriptivo de manera recursiva
     */
    private static objectToDetailedString(obj: any, indent: string = ""): string {
        if (obj === null || obj === undefined) return "null";
        if (typeof obj !== "object") return String(obj);

        let result = "";

        if (Array.isArray(obj)) {
            if (obj.length === 0) return "[]";
            result = obj
                .map((item) => {
                    if (typeof item === "object" && item !== null) {
                        return `\n${indent}  - ${this.objectToDetailedString(
                            item,
                            indent + "  "
                        )}`;
                    }
                    return `\n${indent}  - ${String(item)}`;
                })
                .join("");
            return result;
        }

        const entries = Object.entries(obj);
        if (entries.length === 0) return "{}";

        result = entries
            .map(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    const nestedValue = this.objectToDetailedString(value, indent + "  ");
                    return `\n${indent}${key}: ${nestedValue}`;
                }
                return `\n${indent}${key}: ${String(value)}`;
            })
            .join("");

        return result;
    }

    /**
     * Prepara los datos del error para Sentry de manera recursiva
     */
    private static prepareSentryData(data: any): any {
        if (data === null || data === undefined) return null;
        if (typeof data !== "object") return data;

        if (Array.isArray(data)) {
            return data.map((item) => this.prepareSentryData(item));
        }

        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === "object" && value !== null) {
                result[key] = this.prepareSentryData(value);
            } else {
                result[key] = value;
            }
        }
        return result;
    }

    /**
     * Convert 'body' properties into an object
     * @param event
     */
    private static getBody(
        event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>
    ) {
        try {
            return !event.body ? {} : JSON.parse(event.body);
        } catch (e) {
            // throw new InvalidJsonException()
        }
    }

    /**
     * Convert `pathParameters or queryParams` properties into an object
     *
     * @param params Values pathParameters or queryParams
     */
    private static parseParams(
        params:
            | APIGatewayProxyEventPathParameters
            | APIGatewayProxyEventQueryStringParameters
            | undefined
    ): object {
        return params || {};
    }

    /**
     * get an specific pathParameters
     *
     * @param event    Lambda event
     * @param keyParam Identifier param
     */
    static getPathParamFromEvent(
        event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>,
        keyParam: string
    ): string {
        return Lambda.getParam(Lambda.parseParams(event.pathParameters), keyParam);
    }

    /**
     * get an specific queryParams`
     *
     * @param event    Lambda event
     * @param keyParam Identifier param
     */
    static getQueryParamFromEvent(
        event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>,
        keyParam: string
    ) {
        return Lambda.getParam(
            Lambda.parseParams(event.queryStringParameters),
            keyParam
        );
    }

    static getQueryParamFromInvoke(event: InvocationRequest, keyParam: string) {
        const json = JSON.parse(event.payload);
        if (!json.queryStringParameters) {
            return null;
        }
        return Lambda.getParam(json.queryStringParameters, keyParam);
    }

    /**
     * Get a param from the params object
     *
     * @param params
     * @param keyParam
     * @private
     */
    private static getParam(params: object | any, keyParam: string) {
        return params && typeof params[keyParam] !== "undefined"
            ? params[keyParam]
            : null;
    }

    /**
     * get authenticated user
     * @param requestContext `event.requestContext`
     */
    static authorizerOutput(
        requestContext: APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext>
    ): AuthorizerResponse {
        return process.env.IS_OFFLINE
            ? {
                id: "01G1K58RY9HQBXYZV5K4JBRY6W",
                email: "test@test.com",
                username: "test-user",
            }
            : (requestContext.authorizer?.lambda?.user as AuthorizerResponse);
    }

    /**
     * It gets the token information as an object
     *
     * @param invocationRequest
     */
    static getTokenHeadersObjectFromInvokeEvent(
        invocationRequest: InvocationRequest
    ): AuthToken {
        const setEnvs = (authToken: AuthToken) => {
            process.env.IDUSER = authToken?.idu;
            process.env.IDCOMPANY = authToken?.idc;
            process.env.APPLICATION_VERSION = authToken?.applicationVersion;
            process.env.AUDIT_TRACE_ID = Lambda.getAuditTraceId(invocationRequest);
        };

        const payload = JSON.parse(invocationRequest.payload);
        let authToken: AuthToken;
        if (payload && payload.headers) {
            if (payload.headers.authToken) {
                authToken = payload.headers.authToken as AuthToken;
            } else {
                const decodedToken = decode(payload.headers.authorization) as AuthToken;

                authToken = {
                    api_key: decodedToken.api_key as string,
                    idu: decodedToken.idu as string,
                    email: decodedToken.email as string,
                    exp: decodedToken.exp as number,
                    scope: decodedToken.scope as string,
                    lang: decodedToken.lang as string,
                    org: decodedToken.org as string,
                    idc: decodedToken.idc as string,
                    applicationVersion: decodedToken.applicationVersion as any,
                    iat: decodedToken.iat as number,
                    familyName: decodedToken.familyName as string,
                    givenName: decodedToken.givenName as string,
                    jti: decodedToken.jti as string,
                    tokenHeader: payload.headers.authorization as string,
                };
            }
            setEnvs(authToken);
            return authToken;
        }

        throw new Error("No token found in the headers of the invocation request");
    }

    private static getAuditTraceId(
        event:
            | APIGatewayProxyEventV2WithJWTAuthorizer
            | APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
            | InvocationRequest
            | undefined
    ): string | undefined {
        if (event) {
            if ("payload" in event) {
                const payload = JSON.parse(event.payload);
                return payload?.auditTraceId ?? payload?.body?.auditTraceId;
            } else if (
                event?.headers?.["audit-trace-id"] ||
                event?.headers?.["audittraceid"] ||
                event?.headers?.["auditTraceId"]
            ) {
                return (
                    event?.headers?.["audit-trace-id"] ??
                    event?.headers?.["audittraceid"] ??
                    event?.headers?.["auditTraceId"]
                );
            } else {
                const body = Lambda.getBody(event);
                return body?.auditTraceId;
            }
        }
        return undefined;
    }

    /**
     * Method to get the header token info from invoke
     * But it's necessary to pass the header to the invocation
     *
     * @param event
     */
    static getTokenHeadersObjectFromRequestEvent(
        event: APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
    ): AuthToken {
        const authHeader = event.headers?.authorization;
        let authToken: AuthToken;

        const setEnvs = (authToken: AuthToken) => {
            process.env.IDUSER = authToken.idu;
            process.env.IDCOMPANY = authToken.idc;
            process.env.APPLICATION_VERSION = authToken.applicationVersion;
            process.env.AUDIT_TRACE_ID = Lambda.getAuditTraceId(event);
        };

        if (authHeader?.toLowerCase().includes("bearer ")) {
            const token = authHeader.split(" ");
            const tokenObject = token[1] ? (decode(token[1]) as AuthToken) : null;
            if (tokenObject) {
                authToken = {
                    api_key: tokenObject.api_key as string,
                    idu: tokenObject.idu as string,
                    email: tokenObject.email as string,
                    exp: tokenObject.exp as number,
                    scope: tokenObject.scope as string,
                    lang: tokenObject.lang as string,
                    org: tokenObject.org as string,
                    idc: tokenObject.idc as string,
                    applicationVersion: tokenObject.applicationVersion as any,
                    iat: tokenObject.iat as number,
                    familyName: tokenObject.familyName as string,
                    givenName: tokenObject.givenName as string,
                    jti: tokenObject.jti as string,
                    tokenHeader: token[1] as string,
                };
                setEnvs(authToken);
                return authToken;
            }
        }

        if (event.requestContext?.authorizer) {
            const context = event.requestContext.authorizer.lambda;
            if (context) {
                authToken = {
                    api_key: context.user.api_key,
                    idu: context.user.legacyId,
                    email: context.user.email,
                    lang: "en",
                    idc: context.organization.legacyId,
                    applicationVersion: context.applicationVersion,
                };
                setEnvs(authToken);
                return authToken;
            }
        }

        throw new Error("No token found in the headers of the request event");
    }

    /**
     * Method to get the header token info from invoke
     * But it's necessary to pass the header to the invocation
     *
     * @param event
     */
    static getBodyFromInvokeEvent(event: InvocationRequest) {
        const payload = JSON.parse(event.payload);
        return payload.body;
    }

    static getTokenObjectFromEvent(
        event:
            | InvocationRequest
            | APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
    ) {
        const tokenObject = Lambda.isInvocationEvent(event)
            ? Lambda.getTokenHeadersObjectFromInvokeEvent(event)
            : Lambda.getTokenHeadersObjectFromRequestEvent(event);

        // TODO: Agregar validacion y eliminar "as AuthToken"
        return tokenObject as AuthToken;
    }

    static isInvocationEvent(
        event:
            | InvocationRequest
            | APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
    ): event is InvocationRequest {
        return "payload" in event;
    }
}
