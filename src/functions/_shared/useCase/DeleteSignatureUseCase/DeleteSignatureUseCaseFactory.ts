import { DeleteSignatureUseCaseInterface } from "./contract/DeleteSignatureUseCaseInterface";
import { DeleteSignatureUseCase } from "./DeleteSignatureUseCase";

export class DeleteSignatureUseCaseFactory
{
    public static getInstance(): DeleteSignatureUseCaseInterface
    {
        return new DeleteSignatureUseCase();
    }
}