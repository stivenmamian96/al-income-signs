import { ISignature } from "@functions/_shared/object/ISignature";

export interface DeleteSignatureUseCaseInterface 
{
    execute(signature: ISignature): Promise<void>;
}