import { ISignature } from "@functions/_shared/object/ISignature";
import { GetSignatureUseCaseDTO } from "./GetSignatureUseCaseDTO";

export interface GetSignatureUseCaseInterface {
    execute(params: GetSignatureUseCaseDTO): Promise<ISignature>;
}