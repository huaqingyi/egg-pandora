import { Application } from 'egg';
import { PandoraRouterOption } from './router/core';
import { SwaggerOption } from './swagger';
import { Column, CreateDateColumn, DeleteDateColumn, ObjectIdColumn, PrimaryColumn, UpdateDateColumn, VersionColumn, ViewColumn, ColumnOptions } from 'typeorm';
export * from './swagger';
export * from './aopImpl';
export * from './router';
export * from './typeorm';
export interface PandoraOption {
    router?: PandoraRouterOption;
    swagger?: SwaggerOption;
    typeorm?: boolean;
}
export declare type PColumnDecorator = typeof Column | typeof CreateDateColumn | typeof DeleteDateColumn | typeof ObjectIdColumn | typeof PrimaryColumn | typeof UpdateDateColumn | typeof VersionColumn | typeof ViewColumn;
export declare type PColumnOptions = ColumnOptions;
export declare function PColumn(Col: PColumnDecorator, options?: PColumnOptions): PropertyDecorator;
export declare const bootstrap: (app: Application, config: PandoraOption) => void;
