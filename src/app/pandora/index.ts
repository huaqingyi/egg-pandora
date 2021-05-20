import { Application } from 'egg';
import { PandoraRouterOption } from './router/core';
import { swagger, SwaggerOption } from './swagger';
import {
    Column, CreateDateColumn, DeleteDateColumn, ObjectIdColumn,
    PrimaryColumn, UpdateDateColumn, VersionColumn, ViewColumn,
    ColumnOptions,
} from 'typeorm';
import { typeorm } from './typeorm';
import { DecoratorSchema } from 'class-validator-jsonschema/build/decorators';
import { JSONSchema } from 'class-validator-jsonschema';

export * from './swagger';
export * from './aopImpl';
export * from './router';
export * from './typeorm';

export interface PandoraOption {
    router?: PandoraRouterOption;
    swagger?: SwaggerOption;
    typeorm?: boolean;
}

export type PColumnDecorator = typeof Column | typeof CreateDateColumn | typeof DeleteDateColumn | typeof ObjectIdColumn |
    typeof PrimaryColumn | typeof UpdateDateColumn | typeof VersionColumn | typeof ViewColumn;

export type PColumnOptions = ColumnOptions;

export function PColumn(Col: PColumnDecorator, options: PColumnOptions = {}): PropertyDecorator {
    return function wrapper(target: object, prototypeKey: string | symbol) {
        const schema: DecoratorSchema = {};
        if (options.comment) { schema.description = options.comment; }
        if (options.default) { schema.example = options.default; }
        JSONSchema(schema)(target, prototypeKey as string);
        Col(options)(target, prototypeKey);
    }
}

export const bootstrap = (app: Application, config: PandoraOption) => {
    swagger(app, config.swagger);
    if (config.typeorm !== false) { typeorm(app); }
}
