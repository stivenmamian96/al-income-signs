/**
 * Create DynamoDB client
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */
import { DynamoDB, SharedIniFileCredentials } from "aws-sdk";

export class DynamoDbClient
{
    private dynamoDb: DynamoDB.DocumentClient;

    public constructor()
    {
        let dynamoDb = new DynamoDB.DocumentClient();
        if (process.env.IS_OFFLINE) {
            const awsRegion = process.env.AWS_LOCAL_REGION;
            const awsProfile = process.env.AWS_DEPLOYMENT_PROFILE;
            if (!awsRegion || !awsProfile) {
                throw new Error('LOCAL_S3_REGION and LOCAL_S3_PROFILE must be set in .env file to use local S3');
            }
    
            dynamoDb = new DynamoDB.DocumentClient({
                region: awsRegion,
                credentials: new SharedIniFileCredentials({ profile: awsProfile })
            });
        }
        this.dynamoDb = dynamoDb;
    }

    /**
     * Put an item in the database
     * 
     * @param params 
     * @returns 
     */
    public async putItem(params: DynamoDB.DocumentClient.PutItemInput): Promise<DynamoDB.DocumentClient.PutItemOutput>
    {
        return this.dynamoDb.put(params).promise();
    }

    /**
     * Get an item from the database
     * 
     * @param params 
     * @returns 
     */
    public async getItem(params: DynamoDB.DocumentClient.GetItemInput): Promise<DynamoDB.DocumentClient.GetItemOutput>
    {
        return this.dynamoDb.get(params).promise();
    }

    /**
     * Query an item from the database
     * 
     * @param params 
     * @returns 
     */
    public async query(params: DynamoDB.DocumentClient.QueryInput): Promise<DynamoDB.DocumentClient.QueryOutput>
    {
        return this.dynamoDb.query(params).promise();
    }

    /**
     * Delete an item from the database
     * 
     * @param params 
     * @returns 
     */
    public async deleteItem(params: DynamoDB.DocumentClient.DeleteItemInput): Promise<DynamoDB.DocumentClient.DeleteItemOutput>
    {
        return this.dynamoDb.delete(params).promise();
    }
}