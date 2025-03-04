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
import { SaveSignatureUseCase } from './src/SaveSignatureUseCase';

const saveSign: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    try {
        const signData = await SaveSignatureUseCase({
            idCompany: event.body.idCompany,
            base64Image: event.body.image,
            signatureName: event.body.signatureName
        });

        return formatJSONResponse({
            message: 'Sign saved successfully',
            signData
        });
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

export const main = middyfy(saveSign);
