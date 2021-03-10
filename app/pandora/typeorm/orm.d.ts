import { Repository } from 'typeorm';
export declare type TypeOrmClass<E> = {
    new (...args: any[]): E & TypeOrm<E>;
};
export declare class TypeOrm<T> extends Repository<T> {
}
