import { ValidationError, ValidationSchema } from 'class-validator';
import { EggFile } from 'egg-multipart';
import { SchemaObject } from 'openapi3-ts';
import { PandoraForm } from '../pandora';
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

        param<T = any>(): T;
        param<T = any>(name?: string): T;

        post<T = any>(): T;
        post<T = any>(name?: string): T;

        file(): EggFile[];
        file(name?: string): EggFile;
    }
}

export default {
    ...AOP,
    ...PandoraForm,
};