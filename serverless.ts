import { DevelopmentConfig } from './config/DevelopmentConfig';
import { TestingConfig } from './config/TestingConfig';
import { ProductionConfig } from './config/ProductionConfig';
import { _EnvLoader } from './config/_EnvLoader';
import SaveSignature from '@functions/SaveSignature';
import SignaturesByCompany from '@functions/SignaturesByCompany';

const config = _EnvLoader.loadEnviromentVars();

const serverlessConfiguration = {
    service: 'al-income-signatures',
    frameworkVersion: '4',
    plugins: ['serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        profile: config.Environment.AWS_DEPLOYMENT_PROFILE,
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: ['s3:GetObject', 's3:PutObject'],
                        Resource: `${config.Serverless.SIGNATURES_BUCKET_ARN}/*`
                    },
                    {
                        Effect: 'Allow',
                        Action: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
                        Resource: `${config.Serverless.SIGNATURES_DATABASE_ARN}`
                    }
                ]
            }
        },
        environment: config.Environment,
    },
    functions: { SaveSignature, SignaturesByCompany },
    package: { individually: true },
    build: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node20',
            define: { 'require.resolve': undefined },
            platform: 'node'
        }
    },
    custom: {
        testing: TestingConfig,
        production: ProductionConfig,
        development: DevelopmentConfig,
    },
};

module.exports = serverlessConfiguration;
