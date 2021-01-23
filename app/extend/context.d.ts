import { ValidationError, ValidationSchema } from 'class-validator';
import { EggFile } from 'egg-multipart';
import { SchemaObject } from 'openapi3-ts';
import { Connection } from 'typeorm';
import { TypeOrmClass } from '../pandora/typeorm';
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
declare const _default: {
    repo<E extends new (...props: any) => import("../pandora").TypeOrm<E>>(Entity: E, dbName?: string | undefined): any;
    param(this: import("egg").Context, name?: string | undefined): string | import("egg").PlainObject<string>;
    post(this: import("egg").Context, name?: string | undefined): any;
    file(this: import("egg").Context, name?: string | undefined): EggFile | EggFile[] | undefined;
    schema<T = any>(someClass?: T | undefined): any;
    vaildAOP<T_1>(someClass: new (...args: any[]) => T_1, data: any): Promise<ValidationError[]>;
};
export default _default;
