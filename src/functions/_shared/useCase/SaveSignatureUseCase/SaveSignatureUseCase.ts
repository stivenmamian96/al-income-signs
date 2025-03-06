/**
 * Use case to save the signature image for a company
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { S3Client } from "@shared/aws/S3Client";
import { SaveSignatureUseCaseDTO } from "./SaveSignatureUseCaseDTO";
import { DynamoDbClient } from "@shared/aws/DynamoDbClient";
import { DynamoDB, S3 } from "aws-sdk";
import { SignatureObject } from "@shared/interface/Sign";
import { AllowedImageExtensions } from "@shared/interface/AllowedImageExtensions";

export const SaveSignatureUseCase = async (params: SaveSignatureUseCaseDTO): Promise<SignatureObject> => 
{
    const match = params.base64Image.match(/^data:image\/(png|jpg|jpeg);base64,/);
    if (!match) {
        throw new Error('Formato de imagen Base64 no válido');
    }

    const imageExtension = match[1];
    const imageType = `image/${imageExtension}`;
    if (!Object.values(AllowedImageExtensions).includes(imageType)) {
        throw new Error('Tipo de imagen no permitido');
    }
    const signatureKey = (new Date().getTime());
    const base64Data = params.base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

    const bucketName = process.env.AWS_SIGNATURES_BUCKET_NAME;
    const creationDate = new Date().toISOString();
    const maxUrlExpiration = 1800;

    const bucketParams: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: `${params.idCompany}/${signatureKey}.${imageExtension}`,
        Body: Buffer.from(base64Data, 'base64'),
        ContentType: imageType
    }

    const databaseParams: DynamoDB.DocumentClient.PutItemInput = {
        TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
        Item: {
            companyId: params.idCompany.toString(),
            signatureKey: signatureKey.toString(),
            signatureName: params.signatureName,
            base64Image: base64Data,
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
        companyId: params.idCompany,
        signatureKey: signatureKey.toString(),
        signatureName: params.signatureName,
        base64Image: base64Data,
        bucketKey: bucketParams.Key,
        createdAt: creationDate,
        retrieveUrl: imageUrl,
        urlExpiration: new Date(new Date().getTime() + maxUrlExpiration * 1000).toISOString()
    }
};