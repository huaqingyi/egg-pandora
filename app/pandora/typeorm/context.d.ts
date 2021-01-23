import { TypeOrm } from './orm';
export declare const TypeORM: {
    repo<E extends new (...props: any) => TypeOrm<E>>(Entity: E, dbName?: string | undefined): any;
};
