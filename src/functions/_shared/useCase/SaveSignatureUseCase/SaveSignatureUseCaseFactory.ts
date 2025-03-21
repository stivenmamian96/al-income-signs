import { SaveSignatureUseCaseInterface } from "./contract/SaveSignatureUseCaseInterface";
import { SaveSignatureUseCase } from "./SaveSignatureUseCase";

export class SaveSignatureUseCaseFactory 
{
    static getInstance(): SaveSignatureUseCaseInterface
    {
        return new SaveSignatureUseCase();
    }
}