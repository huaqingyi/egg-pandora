import { validate, ValidationError, ValidationSchema } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import { map } from 'lodash';

export const AOP = {
    schema<T = any>(someClass?: T) {
        if (!someClass) { return validationMetadatasToSchemas(); }
        return (someClass as any).schema();
    },
    async vaildAOP<T>(someClass: {
        new(...args: any[]): T;
    }, data: any): Promise<ValidationError[]> {
        const some: any = new someClass();
        map(data, (o, i) => { some[i] = o; });
        return validate(some);
    }
}
