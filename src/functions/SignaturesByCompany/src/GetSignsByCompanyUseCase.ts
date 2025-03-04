import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { GetSignsByCompanyUseCaseDTO } from "../interface/GetSignsByCompanyUseCaseDTO";
import { DynamoDB } from "aws-sdk";
import { S3Client } from "@functions/_shared/aws/S3Client";
import { GetSignsByCompanyUseCaseDRO } from "../interface/GetSignsByCompanyUseCaseDRO";
import { SignatureObject } from "@functions/_shared/interface/Sign";
import { GetSignsByCompanyAndKeyUseCaseDTO } from "../interface/GetSignsByCompanyAndKeyUseCaseDTO";

export const GetSignsByCompanyUseCase = async (params: GetSignsByCompanyUseCaseDTO): Promise<GetSignsByCompanyUseCaseDRO> => 
{
    const dynamoDb = new DynamoDbClient();
    const s3Client = new S3Client();

    const databaseQuery: DynamoDB.DocumentClient.QueryInput = {
        TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
        KeyConditionExpression: "companyId = :companyId",
        ExpressionAttributeValues: {
            ":companyId": params.companyId.toString()
        }
    };
    
    const queryResult = (await dynamoDb.query(databaseQuery));
    const maxUrlExpiration = 1800;

    let avaiableSigns = await Promise.all(
        queryResult.Items.map(async (signature): Promise<SignatureObject> => {
            let SignatureObject: SignatureObject = {
                signatureKey: signature.signatureKey,
                signatureName: signature.signatureName,
                createdAt: signature.createdAt,
                companyId: signature.companyId,
                bucketKey: signature.bucketKey,
                base64Image: signature.base64Image
            };
            if (params.enableRetrieveUrl) {
                let currentDate = new Date();
                SignatureObject.retrieveUrl = await s3Client.getPresignedUrl(
                    process.env.AWS_SIGNATURES_BUCKET_NAME!,
                    signature.bucketKey,
                    maxUrlExpiration
                );
                SignatureObject.urlExpiration = new Date(
                    currentDate.getTime() + maxUrlExpiration * 1000
                ).toISOString();
            }

            return SignatureObject;
        })
    );

    return {
        count: queryResult.Count,
        signatures: avaiableSigns
    };
}

export const GetSignByCompanyAndSignatureKeyUseCase = async (params: GetSignsByCompanyAndKeyUseCaseDTO): Promise<SignatureObject> => 
{
    const dynamoDb = new DynamoDbClient();
    const s3Client = new S3Client();

    const databaseQuery: DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
        Key: {
            companyId: params.companyId.toString(),
            signatureKey: params.signatureKey.toString()
        }
    };

    const signatureResult = await dynamoDb.getItem(databaseQuery);
    const maxUrlExpiration = 1800;

    if (!signatureResult.Item) {
        throw new Error("Signature not found");
    }

    const signature = signatureResult.Item;

    let SignatureObject: SignatureObject = {
        companyId: signature.companyId,
        signatureKey: signature.signatureKey,
        signatureName: signature.signatureName,
        bucketKey: signature.bucketKey,
        createdAt: signature.createdAt,
        base64Image: signature.base64Image
    }

    if (params.enableRetrieveUrl) {
        let currentDate = new Date();
        SignatureObject.retrieveUrl = await s3Client.getPresignedUrl(
            process.env.AWS_SIGNATURES_BUCKET_NAME!,
            signature.bucketKey,
            maxUrlExpiration
        );
        SignatureObject.urlExpiration = new Date(
            currentDate.getTime() + maxUrlExpiration * 1000
        ).toISOString();
    }

    return SignatureObject;
}