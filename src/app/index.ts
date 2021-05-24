
import { ValidationError, ValidationSchema } from 'class-validator';
import { EggFile } from 'egg-multipart';
import { SchemaObject } from 'openapi3-ts';
import { Connection, EntityTarget, SelectQueryBuilder } from 'typeorm';
import { TypeOrmClass } from './pandora/typeorm';
import { JoinOption } from './pandora/typeorm/orm';

export declare function Repo<LeftEntity, RightEntity>(
    left: EntityTarget<LeftEntity>, right: EntityTarget<RightEntity>,
    config: JoinOption<LeftEntity, RightEntity>,
    callback?: <P>(selection: SelectQueryBuilder<P>, e1: LeftEntity, e2: RightEntity) => SelectQueryBuilder<P>,
): SelectQueryBuilder<LeftEntity | RightEntity>;
export declare function Repo<E>(Entity: TypeOrmClass<E>, dbName?: string): E;

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
        repo: typeof Repo;
    }
}

export * from './pandora';
