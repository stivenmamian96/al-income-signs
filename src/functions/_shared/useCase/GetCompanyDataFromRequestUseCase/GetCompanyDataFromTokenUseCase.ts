import { UnauthorizedError } from "@functions/_shared/errors/userFriendly/UnauthorizedError";
import { ICompanyData } from "@functions/_shared/object/ICompanyData";
import { AuthorizerContext, Lambda } from "@functions/_shared/security/AuthValidation";
import { APIGatewayProxyEventV2WithLambdaAuthorizer } from "aws-lambda";
import { GetCompanyDataFromRequestUseCaseInterface } from "./contract/GetCompanyDataFromRequestUseCaseInterface";

export class GetCompanyDataFromTokenUseCase implements GetCompanyDataFromRequestUseCaseInterface 
{
    execute(event: any): ICompanyData 
    {
        const authHeader = event.headers?.authorization;
        if (!authHeader || !authHeader.toLowerCase().includes('bearer ')) {
            throw new UnauthorizedError('Unauthorized');
        }

        const authToken = Lambda.getTokenHeadersObjectFromRequestEvent(
            event as unknown as APIGatewayProxyEventV2WithLambdaAuthorizer<AuthorizerContext>
        );
        return {
            id: authToken.idc,
            version: authToken.applicationVersion
        };
    }
}