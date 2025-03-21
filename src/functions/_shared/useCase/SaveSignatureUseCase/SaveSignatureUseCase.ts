import { ISignature } from "@functions/_shared/object/ISignature";
import { SaveSignatureUseCaseInterface } from "./contract/SaveSignatureUseCaseInterface";
import { SignatureTypes } from "@functions/_shared/interface/SignatureTypes";
import { CreateImageFromTextUseCaseFactory } from "../CreateImageFromTextUseCase/CreateImageFromTextUseCaseFactory";
import { AllowedImageExtensions } from "@functions/_shared/interface/AllowedImageExtensions";
import { DynamoDB, S3 } from "aws-sdk";
import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { S3Client } from "@functions/_shared/aws/S3Client";
export class SaveSignatureUseCase implements SaveSignatureUseCaseInterface
{
    async execute(signature: ISignature): Promise<ISignature>
    {
        const updatedAt = new Date().toISOString();
        signature.updatedAt = updatedAt;

        const base64Image = await this.getBase64Image(signature);
        signature.base64Image = base64Image;
        const match = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,/);
        if (!match) {
            throw new Error('Image format is not supported');
        }
        const imageExtension = match[1];
        if (!Object.values(AllowedImageExtensions).includes(imageExtension)) {
            throw new Error('Image type is not supported');
        }

        signature.imageExtension = imageExtension;

        if (!signature.signatureKey) {
            signature.signatureKey = new Date().getTime().toString();
            signature.createdAt = updatedAt;
        }

        await this.saveOnBucket(signature);
        await this.saveOnDatabase(signature);

        return signature;
    }

    /**
     * Get the base64 image from the signature
     * 
     * @param signature 
     * @returns 
     */
    private async getBase64Image(signature: ISignature): Promise<string>
    {
        if (signature.base64Image)  {
            signature.type = SignatureTypes.image;
            return signature.base64Image;
        }

        if (signature.textConfig) {
            signature.type = SignatureTypes.text;
            return await CreateImageFromTextUseCaseFactory.getInstance().execute(signature.textConfig);
        }

        throw new Error('There is no base64 image or text config');
    }

    /**
     * Save the signature on the bucket
     * 
     * @param signature 
     * @returns 
     */
    private async saveOnBucket(signature: ISignature): Promise<void>
    {
        const s3 = new S3Client();
        const base64Data = signature.base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        const imageType = `image/${signature.imageExtension}`;
        const bucketName = process.env.AWS_SIGNATURES_BUCKET_NAME;
        const maxUrlExpiration = 1800;

        const bucketParams: S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: `${signature.companyId}/${signature.signatureKey}.${signature.imageExtension}`,
            Body: Buffer.from(base64Data, 'base64'),
            ContentType: imageType
        }

        await s3.upload(bucketParams);
        const imageUrl = await s3.getPresignedUrl(bucketName, bucketParams.Key, maxUrlExpiration);
        signature.bucketKey = bucketParams.Key;
        signature.retrieveUrl = imageUrl;
        signature.urlExpiration = new Date(new Date().getTime() + maxUrlExpiration * 1000).toISOString();
    }

    /**
     * Save the signature on the database
     * 
     * @param signature 
     * @returns 
     */
    private async saveOnDatabase(signature: ISignature): Promise<void>
    {   
        const dynamoDb = new DynamoDbClient();
        const databaseParams: DynamoDB.DocumentClient.PutItemInput = {
            TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
            Item: {
                companyId: signature.companyId.toString(),
                signatureKey: signature.signatureKey,
                signatureName: signature.signatureName,
                base64Image: signature.base64Image,
                bucketKey: signature.bucketKey,
                textConfig: signature.textConfig,
                createdAt: signature.createdAt,
                updatedAt: signature.updatedAt,
            }
        }
        await dynamoDb.putItem(databaseParams);
    }
}