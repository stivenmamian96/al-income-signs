/**
 * This function is responsible for get the available signatures of the company
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
import { GetCompanySignaturesUseCaseFactory } from '@functions/_shared/useCase/GetCompanySignaturesUseCase/GetCompanySignaturesUseCaseFactory';
import { GetCompanyDataFromRequestUseCaseFactory } from '@functions/_shared/useCase/GetCompanyDataFromRequestUseCase/GetCompanyDataFromRequestUseCaseFactory';
import { ISignatureToApiArray } from '@functions/_shared/object/ISignature';

const GetSignatures: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => 
{
    try {
        const companyData = GetCompanyDataFromRequestUseCaseFactory.getInstance().execute(event);
        const {signatureKey, enableRetrieveUrl } = event.queryStringParameters || {};
        const retrieveUrlEnabled = enableRetrieveUrl === 'true';
        

        // Single signature
        if (signatureKey) {
            const signature = await GetSignatureUseCaseFactory.getInstance().execute({
                companyId: companyData.id,
                signatureKey: signatureKey,
                enableRetrieveUrl: retrieveUrlEnabled,
                throwErrorIfNotFound: true,
                includeDeleted: false
            });

            return formatObjectResponse(ISignatureToApiArray(signature));
        }

        // All signatures
        const signatures = await GetCompanySignaturesUseCaseFactory.getInstance().execute({
            companyId: companyData.id,
            enableRetrieveUrl: retrieveUrlEnabled,
            includeDeleted: false
        });

        return formatObjectResponse(signatures.map((signature) => ISignatureToApiArray(signature)));

    } catch (error) {
        return badRequestResponse(error.message);
    }
};

GetSignatures.schema = schema;
export const main = middyfy(GetSignatures);
