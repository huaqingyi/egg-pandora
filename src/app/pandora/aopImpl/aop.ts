import { validate, ValidationError, ValidationSchema } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { Application } from 'egg';
import { map } from 'lodash';

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

export class AOP {
    constructor(
        private app: Application,
    ) {
        this.buildAOP(this.app);
    }

    public buildAOP(app: Application) {
        app.context.schema = this.classToSchema.bind(this);
        app.context.vaildAOP = this.vaildAOP.bind(this);
    }

    public classToSchema(): { [key: string]: SchemaObject; };
    public classToSchema<T>(someClass: {
        new(...args: any[]): T;
    }): ValidationSchema;
    public classToSchema(someClass?: any) {
        if (!someClass) { return validationMetadatasToSchemas(); }
        return (someClass as any).schema();
    }

    public async vaildAOP<T>(someClass: {
        new(...args: any[]): T;
    }, data: any): Promise<ValidationError[]> {
        const some: any = new someClass();
        map(data, (o, i) => { some[i] = o; });
        return validate(some);
    }
}
