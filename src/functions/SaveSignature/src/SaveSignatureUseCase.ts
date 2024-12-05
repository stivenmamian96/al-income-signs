/**
 * Use case to save the signature image for a company
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { S3Client } from "@functions/_shared/aws/S3Client";
import { SaveSignatureUseCaseDTO } from "../interface/SaveSignatureUseCaseDTO";
import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { DynamoDB, S3 } from "aws-sdk";
import { SignatureObject } from "@functions/_shared/interface/Sign";

export const SaveSignatureUseCase = async (params: SaveSignatureUseCaseDTO): Promise<SignatureObject> => 
{
    const imageExtension = params.contentType.split('/')[1];
    const bucketName = process.env.AWS_SIGNATURES_BUCKET_NAME;
    const creationDate = new Date().toISOString();
    const maxUrlExpiration = 1800;

    const bucketParams: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: `${params.keyCountry}/${params.idCompany}/${params.signatureKey}.${imageExtension}`,
        Body: Buffer.from(params.base64Image, 'base64'),
        ContentType: params.contentType
    };

    const databaseParams: DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
        Item: {
            companyId: params.idCompany.toString(),
            signatureKey: params.signatureKey,
            keyCountry: params.keyCountry,
            bucketKey: bucketParams.Key,
            createdAt: creationDate,
        }
    }

    const s3 = new S3Client();
    const dynamoDb = new DynamoDbClient();

    await s3.upload(bucketParams);
    const imageUrl = await s3.getPresignedUrl(bucketName, bucketParams.Key, maxUrlExpiration);
    await dynamoDb.putItem(databaseParams);

    return {
        keyCountry: params.keyCountry,
        companyId: params.idCompany,
        signatureKey: params.signatureKey,
        bucketKey: bucketParams.Key,
        createdAt: creationDate,
        retrieveUrl: imageUrl,
        urlExpiration: new Date(new Date().getTime() + maxUrlExpiration * 1000).toISOString()
    }
};