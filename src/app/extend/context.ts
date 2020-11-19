import { ValidationError, ValidationSchema } from 'class-validator';
import { SchemaObject } from 'openapi3-ts';
import { AOP } from '../pandora/aopImpl/aop';

declare module 'egg' {
    interface Context {
        schema(): { [key: string]: SchemaObject; };
        schema<T>(someClass: {
            new(...args: any[]): T;
        }): ValidationSchema;
        vaildAOP<T>(someClass: {
            new(...args: any[]): T;
        }, data: any): Promise<ValidationError[]>;
    }
}

export default {
    ...AOP,
};