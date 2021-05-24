import { TypeOrm } from './orm';
export declare const TypeORM: {
    repo<E extends new (...props: any) => TypeOrm<E>>(...props: any[]): any;
};
