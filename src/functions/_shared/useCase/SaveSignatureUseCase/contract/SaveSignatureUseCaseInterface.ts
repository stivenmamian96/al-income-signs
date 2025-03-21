import { ISignature } from "@functions/_shared/object/ISignature";

export interface SaveSignatureUseCaseInterface
{
    /**
     * Save the signature on the bucket and the database
     * 
     * @param params 
     */
    execute(params: ISignature): Promise<ISignature>;
}
