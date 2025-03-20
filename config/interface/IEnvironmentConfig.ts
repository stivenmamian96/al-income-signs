export interface IEnvironmentConfig
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: string,
        SIGNATURES_BUCKET_ARN: string,
        LAMBDA_AUTHORIZER_ARN: string,
        CANVAS_LAYER_ARN: string,
        CORS_CONFIG: {
            ALLOWED_ORIGINS: string[],
            ALLOWED_HEADERS: string[],
            ALLOWED_METHODS: string[],
            ALLOW_CREDENTIALS: boolean,
            EXPOSED_RESPONSE_HEADERS: string[],
        }
    },
    Environment: {
        AWS_SIGNATURES_BUCKET_NAME: string,
        AWS_SIGNATURES_DATABASE_TABLE: string,
        AWS_LOCAL_REGION?: string
        AWS_NODEJS_CONNECTION_REUSE_ENABLED?: string,
        AWS_DEPLOYMENT_PROFILE?: string,
        NODE_OPTIONS?: string,
    }
}