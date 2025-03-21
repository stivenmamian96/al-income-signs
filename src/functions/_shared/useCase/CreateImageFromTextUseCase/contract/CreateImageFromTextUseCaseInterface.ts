import { ISignatureText } from "@functions/_shared/object/ISignatureText";

export interface CreateImageFromTextUseCaseInterface 
{
    execute(params: ISignatureText): Promise<string>;
}