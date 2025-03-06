/**
 * Config entry point for the saveSign function
 * 
 * @author    Stiven Mamián <stiven.mamian@alegra.com>
 * @copyright 2024 Soluciones Alegra S.A.S
 * @license   Proprietary/Closed Source Soluciones Alegra S.A.S
 */

import { handlerPath } from '@libs/handler-resolver';
import EndpointSchema from './config/EndpointSchema';

export default 
{
    handler: `${handlerPath(__dirname)}/handler.main`,
    timeout: 30,
    events: [
        {
            http: {
                method: 'post',
                path: '/api/v1/signature-text',
                cors: true,
                request: {
                    schemas: {
                        'application/json': EndpointSchema,
                    },
                },
            },
        },
        {
            http: {
                method: 'options',
                path: '/api/v1/signature-text',
                cors: true,
            },
        },
    ],
};
