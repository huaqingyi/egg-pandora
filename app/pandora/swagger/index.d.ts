import { Application } from 'egg';
import { Document, SwaggerOption } from './document';
export * from './document';
export * from './constant';
export declare const swagger: (app: Application, config?: SwaggerOption | undefined) => Document;
