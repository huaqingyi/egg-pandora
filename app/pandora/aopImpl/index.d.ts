import { Application } from 'egg';
import { AOP } from './aop';
export * from './aop';
export * from './dto';
export * from 'class-validator';
export * from 'class-validator-jsonschema';
export declare const aop: (app: Application) => AOP;
