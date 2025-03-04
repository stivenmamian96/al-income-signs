/**
 * Config entry point for the saveSign function
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import EndpointSchema from './config/EndpointSchema';
import { handlerPath } from '@libs/handler-resolver';

export default 
{
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/api/v1/signature',
                request: {
                    schemas: {
                        'application/json': EndpointSchema,
                    },
                },
            },
        },
    ],
};
