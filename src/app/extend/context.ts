import { ValidationError, ValidationSchema } from 'class-validator';
import { EggFile } from 'egg-multipart';
import { SchemaObject } from 'openapi3-ts';
import { Connection } from 'typeorm';
import { PandoraForm } from '../pandora';
import { AOP } from '../pandora/aopImpl/aop';
import { TypeORM, TypeOrmClass } from '../pandora/typeorm';

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

        connection: Connection;
        repo: <E extends TypeOrmClass<E>>(Entity: E, dbName?: string) => E;
    }
}

export default {
    ...AOP,
    ...PandoraForm,
    ...TypeORM,
};