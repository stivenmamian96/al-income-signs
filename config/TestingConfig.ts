import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: 'alegrasignsimages',
    AWS_SIGNATURES_DATABASE_TABLE: 'alegra-income-signs',
    AWS_LOCAL_REGION: 'us-east-1',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECURITY_TOKEN: "income-signs/security-token"
}

export const TestingConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: 'arn:aws:dynamodb:us-east-1:176986283156:table/alegra-income-signatures',
        SIGNATURES_BUCKET_ARN: 'arn:aws:s3:::alegrasignsimages',
    },
    Environment
}