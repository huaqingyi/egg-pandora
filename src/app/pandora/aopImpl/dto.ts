import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class Dto {

    public static schema() {
        return (validationMetadatasToSchemas() as any)[this.name];
    }
}
