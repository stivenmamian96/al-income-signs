import { ICompanyData } from "@shared/object/ICompanyData";

export interface GetCompanyDataFromRequestUseCaseInterface 
{
    /**
     * Execute the use case to get the company data from the request
     * could be from the query string or the body or token
     * 
     * @param event 
     * @returns 
     */
    execute(event: any): ICompanyData;
}