import { IEnvironmentConfig } from "./interface/IEnvironmentConfig"
import * as dotenv from 'dotenv';
import * as path from 'path';


const pathResoved = path.resolve(process.cwd(), '.env');
dotenv.config({ path: pathResoved });

const Environment: IEnvironmentConfig['Environment'] = {
    AWS_SIGNATURES_BUCKET_NAME: process.env.SIGNS_BUCKET,
    AWS_SIGNATURES_DATABASE_TABLE: process.env.SIGNS_DATABASE_TABLE,
    AWS_DEPLOYMENT_PROFILE: process.env.AWS_PROFILE,
    AWS_LOCAL_REGION: process.env.AWS_REGION,
}

export const DevelopmentConfig: IEnvironmentConfig = 
{
    Serverless: {
        SIGNATURES_DATABASE_ARN: 'arn:aws:dynamodb:us-east-1:176986283156:table/alegra-income-signs',
        SIGNATURES_BUCKET_ARN: 'arn:aws:s3:::alegrasignsimages',
        LAMBDA_AUTHORIZER_ARN: process.env.LAMBDA_AUTHORIZER_ARN ?? '',
        CANVAS_LAYER_ARN: process.env.CANVAS_LAYER_ARN ?? '',
        CORS_CONFIG: {
            ALLOWED_ORIGINS: ['*'],
            ALLOWED_HEADERS: ['*'],
            ALLOWED_METHODS: ['*'],
            ALLOW_CREDENTIALS: false,
            EXPOSED_RESPONSE_HEADERS: [],
        }
    },
    Environment
}