import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { GetSignsByCompanyUseCaseDTO } from "../interface/GetSignsByCompanyUseCaseDTO";
import { DynamoDB } from "aws-sdk";
import { S3Client } from "@functions/_shared/aws/S3Client";
import { GetSignsByCompanyUseCaseDRO } from "../interface/GetSignsByCompanyUseCaseDRO";
import { SignatureObject } from "@functions/_shared/interface/Sign";

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
                createdAt: signature.createdAt,
                companyId: signature.companyId,
                keyCountry: signature.keyCountry,
                bucketKey: signature.bucketKey
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