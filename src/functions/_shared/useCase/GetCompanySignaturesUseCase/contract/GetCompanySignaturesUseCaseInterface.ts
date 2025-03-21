import { ISignature } from "@functions/_shared/object/ISignature";
import { GetCompanySignaturesUseCaseDTO } from "./GetCompanySignaturesUseCaseDTO";

export interface GetCompanySignaturesUseCaseInterface {
    execute(params: GetCompanySignaturesUseCaseDTO): Promise<ISignature[]>;
}