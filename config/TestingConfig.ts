import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: 'al-income-signatures',
    AWS_SIGNATURES_DATABASE_TABLE: 'al-income-signatures',
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    SECURITY_TOKEN: 'pqnJP4FjLrFUXGAfqgnSBNF6waHBWiBNoA5XM3LJDyqnzHpR1Vr5WiCM6G17dXUU'
}

export const TestingConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: `arn:aws:dynamodb:us-east-1:647089136475:table/${Environment.AWS_SIGNATURES_DATABASE_TABLE}`,
        SIGNATURES_BUCKET_ARN: `arn:aws:s3:::${Environment.AWS_SIGNATURES_BUCKET_NAME}`,
        LAMBDA_AUTHORIZER_ARN: 'arn:aws:lambda:us-east-1:812368164925:function:alegra-auth-test-authorizer'
    },
    Environment
}