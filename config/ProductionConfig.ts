import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: 'al-income-signatures',
    AWS_SIGNATURES_DATABASE_TABLE: 'al-income-signatures',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
}

export const ProductionConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: '',
        SIGNATURES_BUCKET_ARN: '',
        LAMBDA_AUTHORIZER_ARN: 'arn:aws:lambda:us-east-1:857745039400:function:alegra-auth-prod-authorizer'
    },
    Environment
}