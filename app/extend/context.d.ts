import { ValidationError, ValidationSchema } from 'class-validator';
import { SchemaObject } from 'openapi3-ts';
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
declare const _default: {
    schema<T = any>(someClass?: T | undefined): any;
    vaildAOP<T_1>(someClass: new (...args: any[]) => T_1, data: any): Promise<ValidationError[]>;
};
export default _default;
