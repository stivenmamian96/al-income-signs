/**
 * Load environment variables from env configs
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { DevelopmentConfig } from "./DevelopmentConfig";
import { IEnvironmentConfig } from "./interface/IEnvironmentConfig";
import { ProductionConfig } from "./ProductionConfig";
import { TestingConfig } from "./TestingConfig";

export class _EnvLoader
{
    /**
     * Load environment variables from env configs
     * 
     * @returns IEnvironmentConfig
     */
    public static loadEnviromentVars(): IEnvironmentConfig
    {
        const args = process.argv.slice(2);
        const stage = args.find((arg) => arg.startsWith('--stage='))?.split('=')[1];
        const profile = args.find((arg) => arg.startsWith('--aws-profile='))?.split('=')[1];

        const avaiableStages = {
            development: DevelopmentConfig,
            testing: TestingConfig,
            production: ProductionConfig
        };

        if (!stage || !avaiableStages[stage]) {
            const avaiableStagesStr = Object.keys(avaiableStages).join(' | ');
            throw new Error(`Invalid stage using serverless\n\nUse --stage=[${avaiableStagesStr}]`);
        }

        const selectedStage = avaiableStages[stage];
        if (profile && !selectedStage.Environment.AWS_DEPLOYMENT_PROFILE) {
            selectedStage.Environment.AWS_DEPLOYMENT_PROFILE = profile;
        }

        if (stage !== 'development') {
            const ssmToken = "${ssm:/" + selectedStage.Environment.SECURITY_TOKEN + "}";
            selectedStage.Environment.SECURITY_TOKEN = ssmToken;
        }

        return selectedStage;
    }

}