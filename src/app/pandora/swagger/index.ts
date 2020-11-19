import { Application } from 'egg';
import { Document, SwaggerOption } from './document';

export * from './document';
export * from './constant';

export const swagger = (app: Application, config?: SwaggerOption) => {
    return new Document(app, config);
};
