import { ValidationError, ValidationSchema } from 'class-validator';
import { SchemaObject } from 'openapi3-ts';
import { Application } from 'egg';
declare module 'egg' {
    interface Context {
        schema(): {
            [key: string]: SchemaObject;
        };
        schema<T>(someClass: {
            new (...args: any[]): T;
        }): ValidationSchema;
        vaildAOP<T>(someClass: {
            new (...args: any[]): T;
        }, data: any): Promise<ValidationError[]>;
    }
}
export declare class AOP {
    private app;
    constructor(app: Application);
    buildAOP(app: Application): void;
    classToSchema(): {
        [key: string]: SchemaObject;
    };
    classToSchema<T>(someClass: {
        new (...args: any[]): T;
    }): ValidationSchema;
    vaildAOP<T>(someClass: {
        new (...args: any[]): T;
    }, data: any): Promise<ValidationError[]>;
}
