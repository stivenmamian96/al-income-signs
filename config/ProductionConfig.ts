import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: 'al-income-signatures',
    AWS_SIGNATURES_DATABASE_TABLE: 'al-income-signatures',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECURITY_TOKEN: 'income-signatures/security-token'
}

export const ProductionConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: '',
        SIGNATURES_BUCKET_ARN: '',
    },
    Environment
}