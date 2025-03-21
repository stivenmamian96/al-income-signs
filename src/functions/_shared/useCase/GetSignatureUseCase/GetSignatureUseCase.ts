import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { GetSignatureUseCaseDTO } from "./contract/GetSignatureUseCaseDTO";
import { GetSignatureUseCaseInterface } from "./contract/GetSignatureUseCaseInterface";
import { ISignature } from "@functions/_shared/object/ISignature";
import { S3Client } from "@functions/_shared/aws/S3Client";
import { DynamoDB } from "aws-sdk";

export class GetSignatureUseCase implements GetSignatureUseCaseInterface 
{
    async execute(params: GetSignatureUseCaseDTO): Promise<ISignature> 
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

        if (!signatureResult.Item && params.throwErrorIfNotFound) {
            throw new Error("Signature not found");
        }

        if (!signatureResult.Item) {
            return null;
        }

        const signature = signatureResult.Item;

        let SignatureObject: ISignature = {
            companyId: signature.companyId,
            signatureKey: signature.signatureKey,
            signatureName: signature.signatureName,
            bucketKey: signature.bucketKey,
            createdAt: signature.createdAt,
            base64Image: signature.base64Image,
            enabled: signature.enabled ?? true
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
}
