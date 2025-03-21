import { GetSignatureUseCaseInterface } from "./contract/GetSignatureUseCaseInterface";
import { GetSignatureUseCase } from "./GetSignatureUseCase";

export class GetSignatureUseCaseFactory 
{
    public static getInstance(): GetSignatureUseCaseInterface 
    {
        return new GetSignatureUseCase();
    }
}