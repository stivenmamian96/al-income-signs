import type { AWS } from '@serverless/typescript';

export interface IServerlessConfig extends AWS {
    build: any
}