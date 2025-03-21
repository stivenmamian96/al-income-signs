import { ISignature } from "@functions/_shared/object/ISignature";
import { GetCompanySignaturesUseCaseDTO } from "./contract/GetCompanySignaturesUseCaseDTO";
import { GetCompanySignaturesUseCaseInterface } from "./contract/GetCompanySignaturesUseCaseInterface";
import { DynamoDbClient } from "@functions/_shared/aws/DynamoDbClient";
import { S3Client } from "@functions/_shared/aws/S3Client";
import { DynamoDB } from "aws-sdk";
import { SignatureTypes } from "@functions/_shared/interface/SignatureTypes";

export class GetCompanySignaturesUseCase implements GetCompanySignaturesUseCaseInterface
{
    async execute(params: GetCompanySignaturesUseCaseDTO): Promise<ISignature[]> 
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
            queryResult.Items.map(async (signature): Promise<ISignature> => {
                let SignatureObject: ISignature = {
                    signatureKey: signature.signatureKey,
                    signatureName: signature.signatureName,
                    createdAt: signature.createdAt,
                    companyId: signature.companyId,
                    bucketKey: signature.bucketKey,
                    base64Image: signature.base64Image,
                    type: signature.type ?? SignatureTypes.image,
                    textConfig: signature.textConfig,
                    enabled: signature.enabled ?? true
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

        if (params.includeDeleted) {
            return avaiableSigns;
        }

        return avaiableSigns.filter((signature) => signature.enabled);
    }
}