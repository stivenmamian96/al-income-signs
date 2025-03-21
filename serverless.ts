import { DevelopmentConfig } from './config/DevelopmentConfig';
import { TestingConfig } from './config/TestingConfig';
import { ProductionConfig } from './config/ProductionConfig';
import { _EnvLoader } from './config/_EnvLoader';
import SaveSignature from '@functions/SaveSignature';
import SignaturesByCompany from '@functions/GetSignatures';
import { IServerlessConfig } from './config/IServerlessTypes';
import UpdateSignature from '@functions/UpdateSignature';

const config = _EnvLoader.loadEnviromentVars();

const serverlessConfiguration: IServerlessConfig = {
    service: 'al-pdf-signatures-api',
    frameworkVersion: '4',
    plugins: ['serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        profile: config.Environment.AWS_DEPLOYMENT_PROFILE,
        httpApi: {
            cors: {
                allowedOrigins: config.Serverless.CORS_CONFIG.ALLOWED_ORIGINS,
                allowedHeaders: config.Serverless.CORS_CONFIG.ALLOWED_HEADERS,
                allowedMethods: config.Serverless.CORS_CONFIG.ALLOWED_METHODS,
                allowCredentials: config.Serverless.CORS_CONFIG.ALLOW_CREDENTIALS,
                exposedResponseHeaders: config.Serverless.CORS_CONFIG.EXPOSED_RESPONSE_HEADERS,
            },
            authorizers: {
                lambdaAuthorizer: {
                    type: 'request',
                    name: 'lambdaAuthorizer',
                    functionArn: config.Serverless.LAMBDA_AUTHORIZER_ARN,
                    resultTtlInSeconds: 30,
                    enableSimpleResponses: false,
                    payloadVersion: '2.0',
                    identitySource: ["$request.header.Authorization"],
                    managedExternally: true
                }
            }
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
    functions: { 
        SignaturesByCompany, 
        SaveSignature: {
            ...SaveSignature,
            layers: [
                config.Serverless.CANVAS_LAYER_ARN
            ],
        },
        UpdateSignature: {
            ...UpdateSignature,
            layers: [
                config.Serverless.CANVAS_LAYER_ARN
            ],
        }
    },
    package: { 
        individually: true,
        patterns: [
            'src/functions/SaveSignature/resources/fonts/**'
        ]
    },
    build: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk', 'canvas', '@napi-rs/canvas'],
            target: 'node20',
            define: { 'require.resolve': undefined },
            platform: 'node',
            external: ['canvas']
        }
    },
    custom: {
        testing: TestingConfig,
        production: ProductionConfig,
        development: DevelopmentConfig,
    },
};

module.exports = serverlessConfiguration;
