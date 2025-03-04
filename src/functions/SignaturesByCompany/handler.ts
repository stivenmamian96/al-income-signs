/**
 * This function is responsible for get the available signatures of the company
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { badRequestResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './config/EndpointSchema';
import { GetSignByCompanyAndSignatureKeyUseCase, GetSignsByCompanyUseCase } from './src/GetSignsByCompanyUseCase';

const signsByCompany: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    try {
        const { companyId, signatureKey, enableRetrieveUrl } = event.queryStringParameters || {};
        if (!companyId) {
            return badRequestResponse('Missing required companyId parameter');
        }

        const retrieveUrlEnabled = enableRetrieveUrl === 'true';

        if (signatureKey) {
            const signature = await GetSignByCompanyAndSignatureKeyUseCase({
                companyId: companyId,
                signatureKey: signatureKey,
                enableRetrieveUrl: retrieveUrlEnabled
            });

            return formatJSONResponse({
                ...signature
            });
        }
        const signsResponse = await GetSignsByCompanyUseCase({
            companyId: companyId,
            enableRetrieveUrl: retrieveUrlEnabled
        });

        return formatJSONResponse({
            statusCode: 200,
            body: signsResponse
        });
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

export const main = middyfy(signsByCompany);
