import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: 'al-pdf-signatures',
    AWS_SIGNATURES_DATABASE_TABLE: 'al-pdf-signatures',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
}

export const ProductionConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: `arn:aws:dynamodb:us-east-1:104136624701:table/${Environment.AWS_SIGNATURES_DATABASE_TABLE}`,
        SIGNATURES_BUCKET_ARN: `arn:aws:s3:::${Environment.AWS_SIGNATURES_BUCKET_NAME}`,
        LAMBDA_AUTHORIZER_ARN: 'arn:aws:lambda:us-east-1:857745039400:function:alegra-auth-prod-authorizer',
        CANVAS_LAYER_ARN: 'arn:aws:lambda:us-east-1:104136624701:layer:canvas-nodejs:1',
        CORS_CONFIG: {
            ALLOWED_ORIGINS: ['https://app.alegra.com'],
            ALLOWED_HEADERS: ['*'],
            ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            ALLOW_CREDENTIALS: false,
            EXPOSED_RESPONSE_HEADERS: [],
        }
    },
    Environment
}