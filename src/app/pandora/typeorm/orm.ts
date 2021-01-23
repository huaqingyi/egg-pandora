import { Repository } from 'typeorm';

export declare type TypeOrmClass<E> = (new (...args: any[]) => E & TypeOrm<E>) & typeof TypeOrm;

export class TypeOrm<T> extends Repository<T> {

}
