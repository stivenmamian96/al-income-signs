/**
 * This function is responsible for saving the signature of the company.
 * and return response with the URL of the saved image.
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './config/EndpointSchema';
import { SaveSignatureUseCase } from './src/SaveSignatureUseCase';

const saveSign: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    const signData = await SaveSignatureUseCase({
        base64Image: event.body.image,
        contentType: event.body.imageType,
        idCompany: event.body.idCompany,
        keyCountry: event.body.keyCountry,
        signatureKey: event.body.signatureKey
    });

    return formatJSONResponse({
        message: 'Sign saved successfully',
        signData
    });
};

export const main = middyfy(saveSign);
