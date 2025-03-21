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
import { SaveSignatureUseCaseFactory } from '@functions/_shared/useCase/SaveSignatureUseCase/SaveSignatureUseCaseFactory';
import { ISignatureText } from '@functions/_shared/object/ISignatureText';
import { ISignatureToApiArray } from '@functions/_shared/object/ISignature';

const saveSign: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    try {
        const companyData = GetCompanyDataFromRequestUseCaseFactory.getInstance().execute(event);
        const signature = await SaveSignatureUseCaseFactory.getInstance().execute({
            companyId: companyData.id,
            base64Image: event.body.image,
            textConfig: event.body.textConfig as ISignatureText,
            signatureName: event.body.signatureName,
            enabled: true,
        });

        return formatObjectResponse(ISignatureToApiArray(signature));
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

saveSign.schema = schema;
export const main = middyfy(saveSign);
