import { ISignature } from "@functions/_shared/object/ISignature";
import { DeleteSignatureUseCaseInterface } from "./contract/DeleteSignatureUseCaseInterface";
import { DynamoDB, S3 } from "aws-sdk";
import { S3Client } from "@functions/_shared/aws/S3Client";
import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";

export class DeleteSignatureUseCase implements DeleteSignatureUseCaseInterface 
{
    async execute(signature: ISignature): Promise<void> 
    {
        await this.deleteFromBucket(signature);
        await this.deleteFromDatabase(signature);
    }

    /**
     * Delete the signature from the bucket
     * 
     * @param signature 
     * @returns 
     */
    private async deleteFromBucket(signature: ISignature): Promise<void>
    {
        const s3 = new S3Client();
        const bucketName = process.env.AWS_SIGNATURES_BUCKET_NAME;
        const bucketParams: S3.DeleteObjectRequest = {
            Bucket: bucketName,
            Key: signature.bucketKey
        };

        await s3.deleteObject(bucketParams);
    }

    /**
     * Delete the signature from the database
     * 
     * @param signature 
     * @returns 
     */
    private async deleteFromDatabase(signature: ISignature): Promise<void>
    {
        const dynamoDb = new DynamoDbClient();
        const databaseParams: DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: process.env.AWS_SIGNATURES_DATABASE_TABLE,
            Key: {
                companyId: signature.companyId.toString(),
                signatureKey: signature.signatureKey
            }
        };

        await dynamoDb.deleteItem(databaseParams);
    }
}