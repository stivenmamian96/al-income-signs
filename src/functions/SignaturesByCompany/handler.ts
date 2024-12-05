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
import { GetSignsByCompanyUseCase } from './src/GetSignsByCompanyUseCase';

const signsByCompany: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    const { companyId, enableRetrieveUrl } = event.queryStringParameters || {};
    if (!companyId) {
        return badRequestResponse('Missing required companyId parameter');
    }

    const retrieveUrlEnabled = enableRetrieveUrl === 'true';
    const signsResponse = await GetSignsByCompanyUseCase({
        companyId: companyId,
        enableRetrieveUrl: retrieveUrlEnabled
    });

    return formatJSONResponse({
        statusCode: 200,
        body: signsResponse
    });
};

export const main = middyfy(signsByCompany);
