export interface IEnvironmentConfig
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: string,
        SIGNATURES_BUCKET_ARN: string
    },
    Environment: {
        AWS_SIGNATURES_BUCKET_NAME: string,
        AWS_SIGNATURES_DATABASE_TABLE: string,
        AWS_LOCAL_REGION?: string
        AWS_NODEJS_CONNECTION_REUSE_ENABLED?: string,
        AWS_DEPLOYMENT_PROFILE?: string,
        NODE_OPTIONS?: string,
        SECURITY_TOKEN: string,
    }
}