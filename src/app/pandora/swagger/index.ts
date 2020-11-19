import { Application } from 'egg';
import { Document } from './document';

export * from './document';
export * from './constant';

export const swagger = (app: Application) => {
    return new Document(app);
};
