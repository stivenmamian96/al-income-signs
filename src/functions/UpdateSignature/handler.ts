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
import { GetSignatureUseCaseFactory } from '@functions/_shared/useCase/GetSignatureUseCase/GetSignatureUseCaseFactory';
import { GetCompanyDataFromRequestUseCaseFactory } from '@functions/_shared/useCase/GetCompanyDataFromRequestUseCase/GetCompanyDataFromRequestUseCaseFactory';
import { ISignatureText } from '@functions/_shared/object/ISignatureText';
import { SaveSignatureUseCaseFactory } from '@functions/_shared/useCase/SaveSignatureUseCase/SaveSignatureUseCaseFactory';
import { ISignatureToApiArray } from '@functions/_shared/object/ISignature';

const UpdateSignature: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    try {
        const companyData = GetCompanyDataFromRequestUseCaseFactory.getInstance().execute(event);
        const signature = await GetSignatureUseCaseFactory.getInstance().execute({
            companyId: companyData.id,
            signatureKey: event.body.signatureKey,
            enableRetrieveUrl: false,
            throwErrorIfNotFound: true,
            includeDeleted: false
        });

        if (event.body.signatureName) {
            signature.signatureName = event.body.signatureName;
        }

        if (event.body.image) {
            signature.base64Image = event.body.image;
            signature.textConfig = null;
            event.body.textConfig = null;
        }

        if (event.body.textConfig) {
            signature.base64Image = null;
            signature.textConfig = event.body.textConfig as ISignatureText;
            event.body.image = null;
        }

        const updatedSignature = await SaveSignatureUseCaseFactory.getInstance().execute(signature);

        return formatObjectResponse(ISignatureToApiArray(updatedSignature));
        
    } catch (error) {
        return badRequestResponse(error.message);
    }
};

UpdateSignature.schema = schema;
export const main = middyfy(UpdateSignature);
