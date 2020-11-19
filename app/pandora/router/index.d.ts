import 'reflect-metadata';
import { Application } from 'egg';
export * from './decorators';
export declare const router: (app: Application) => Promise<Application | (new (...props: any) => import("egg").Controller)[]>;
