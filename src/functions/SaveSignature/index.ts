/**
 * Config entry point for the saveSign function
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */
import { handlerPath } from '@libs/handler-resolver';

const isLocalServerless = process.env.LOCAL_SERVERLESS === 'true';

export default 
{
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 30,
    events: [
        {
            httpApi: {
                method: 'post',
                path: '/api/v1/signature',
                ... (!isLocalServerless && {
                    authorizer: {
                        name: 'lambdaAuthorizer'
                    }
                })
            },
        }
    ],
};
