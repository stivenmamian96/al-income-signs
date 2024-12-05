/**
 * Create S3 client
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { S3, SharedIniFileCredentials } from "aws-sdk";

export class S3Client {

    private s3: S3;

    public constructor() 
    {
        let s3 = new S3();
        if (process.env.IS_OFFLINE) {
            const awsRegion = process.env.AWS_LOCAL_REGION;
            const awsProfile = process.env.AWS_DEPLOYMENT_PROFILE;
            if (!awsRegion || !awsProfile) {
                throw new Error('LOCAL_S3_REGION and LOCAL_S3_PROFILE must be set in .env file to use local S3');
            }
            s3 = new S3({
                region: awsRegion, 
                credentials: new SharedIniFileCredentials({ profile: awsProfile }) 
            });
        }
        this.s3 = s3;
    }

    public async upload(params: S3.Types.PutObjectRequest): Promise<S3.ManagedUpload.SendData>
    {
        return this.s3.upload(params).promise();   
    }

    public async getPresignedUrl(bucketName: string, objectKey: string, expiration: number): Promise<string>
    {
        const url = await this.s3.getSignedUrlPromise('getObject', {
            Bucket: bucketName,
            Key: objectKey,
            Expires: expiration,
        });
        return url;
    }
}