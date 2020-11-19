import { Application } from 'egg';
import { Document } from './document';
export * from './document';
export * from './constant';
export declare const swagger: (app: Application) => Document;
