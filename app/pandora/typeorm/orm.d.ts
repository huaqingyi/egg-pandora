import { Repository, EntityTarget, SelectQueryBuilder } from 'typeorm';
export declare type TypeOrmClass<E> = {
    new (...args: any[]): E & TypeOrm<E>;
};
export declare class TypeOrm<T> extends Repository<T> {
}
export declare function uniqueId(length?: number): string;
export declare enum JoinType {
    LEFT = "leftJoinAndSelect",
    RIGHT = "rightJoinAndSelect",
    INNER = "innerJoinAndSelect"
}
export declare type JoinOnCallback<E1, E2> = [(target: E1) => any, (target: E2) => any];
export interface JoinField {
    array?: true;
    field?: string;
}
export interface JoinOption<E1, E2> {
    type?: JoinType;
    on: Array<JoinOnCallback<E1, E2>> | JoinOnCallback<E1, E2>;
    fields: (e1: E1, e2: E2) => {
        [x: string]: string | JoinField;
    };
    groupBy: (e1: E1, e2: E2) => any[];
}
export declare function join<LeftEntity, RightEntity>(left: EntityTarget<LeftEntity>, right: EntityTarget<RightEntity>, config: JoinOption<LeftEntity, RightEntity>, callback?: <P>(selection: SelectQueryBuilder<P>, e1: LeftEntity, e2: RightEntity) => SelectQueryBuilder<P>): SelectQueryBuilder<LeftEntity>;
