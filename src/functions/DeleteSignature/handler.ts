/**
 * This function is responsible for saving the signature of the company.
 * and return response with the URL of the saved image.
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { badRequestResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './config/EndpointSchema';
import { GetCompanyDataFromRequestUseCaseFactory } from '@functions/_shared/useCase/GetCompanyDataFromRequestUseCase/GetCompanyDataFromRequestUseCaseFactory';

const DeleteSignature: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{

    const companyData = GetCompanyDataFromRequestUseCaseFactory.getInstance().execute(event);
    try {

        const signatureKey = event.body.signatureKey;

        const signature = 


        return formatJSONResponse({
            message: 'Sign saved successfully',
            signData
        });
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

export const main = middyfy(DeleteSignature);
