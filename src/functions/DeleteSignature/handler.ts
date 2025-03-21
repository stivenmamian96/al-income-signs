/**
 * This function is responsible for saving the signature of the company.
 * and return response with the URL of the saved image.
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { badRequestResponse, formatObjectResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './config/EndpointSchema';
import { GetCompanyDataFromRequestUseCaseFactory } from '@functions/_shared/useCase/GetCompanyDataFromRequestUseCase/GetCompanyDataFromRequestUseCaseFactory';
import { GetSignatureUseCaseFactory } from '@functions/_shared/useCase/GetSignatureUseCase/GetSignatureUseCaseFactory';
import { DeleteSignatureUseCaseFactory } from '@functions/_shared/useCase/DeleteSignatureUseCase/DeleteSignatureUseCaseFactory';

const DeleteSignature: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{

    const companyData = GetCompanyDataFromRequestUseCaseFactory.getInstance().execute(event);
    try {
        const signature = await GetSignatureUseCaseFactory.getInstance().execute({
            companyId: companyData.id,
            signatureKey: event.body.signatureKey,
            enableRetrieveUrl: false,
            throwErrorIfNotFound: true,
            includeDeleted: false
        });

        await DeleteSignatureUseCaseFactory.getInstance().execute(signature);
        return formatObjectResponse({
            message: 'Signature deleted successfully'
        });
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

DeleteSignature.schema = schema;
export const main = middyfy(DeleteSignature);
