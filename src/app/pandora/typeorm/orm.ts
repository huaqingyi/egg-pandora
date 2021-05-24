import { Repository, EntityTarget, getManager, SelectQueryBuilder } from 'typeorm';
import { map, isArray, isObject } from 'lodash';

export declare type TypeOrmClass<E> = {
    new(...args: any[]): E & TypeOrm<E>;
};

export class TypeOrm<T> extends Repository<T> {

}

export function uniqueId(length: number = 6) {
    const data = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z'
    ];
    let nums = '';
    for (let i = 0; i < length; i++) {
        const r = parseInt(String(Math.random() * 51));
        nums += data[r];
    }
    return nums;
}

export enum JoinType {
    LEFT = 'leftJoinAndSelect',
    RIGHT = 'rightJoinAndSelect',
    INNER = 'innerJoinAndSelect',
}

export type JoinOnCallback<E1, E2> = [(target: E1) => any, (target: E2) => any];

export interface JoinField {
    array?: true;
    field?: string;
}

export interface JoinOption<E1, E2> {
    type?: JoinType;
    on: Array<JoinOnCallback<E1, E2>> | JoinOnCallback<E1, E2>;
    fields: (e1: E1, e2: E2) => { [x: string]: string | JoinField; };
    groupBy: (e1: E1, e2: E2) => any[],
}

export function join<LeftEntity, RightEntity>(
    left: EntityTarget<LeftEntity>, right: EntityTarget<RightEntity>,
    config: JoinOption<LeftEntity, RightEntity>,
    callback?: <P>(selection: SelectQueryBuilder<P>, e1: LeftEntity, e2: RightEntity) => SelectQueryBuilder<P>,
) {

    const lger = getManager().getRepository(left);
    const rger = getManager().getRepository(right);
    const ltn = uniqueId(6);
    const rtn = uniqueId(6);

    if (config.type) config.type = JoinType.LEFT;

    const lcol: any = {};
    const rcol: any = {};
    map(lger.metadata.columns, ({ databaseName, propertyName }) => lcol[propertyName] = `${ltn}.${databaseName}`);
    map(rger.metadata.columns, ({ databaseName, propertyName }) => rcol[propertyName] = `${rtn}.${databaseName}`);
    let ons: Array<JoinOnCallback<LeftEntity, RightEntity>> = [];
    if (!isArray(config.on[0])) {
        ons.push(config.on as JoinOnCallback<LeftEntity, RightEntity>);
    } else {
        ons = config.on as Array<JoinOnCallback<LeftEntity, RightEntity>>;
    }
    const on = map(ons, ([l, r]: Function[]) => {
        return `${l(lcol)} = ${r(rcol)}`;
    }).join(',');
    let builder = lger.createQueryBuilder(ltn).leftJoinAndSelect(
        right as any, rtn, on
    ).select(map(config.fields(lcol, rcol), (o, i) => {
        if (isObject(o)) {
            if (o.array === true) {
                return `GROUP_CONCAT(${i}) as ${o.field}`;
            }
            return `${i} as ${o.field}`;
        }
        return `${i} as ${o}`;
    }).join(','));
    const groupBy = config.groupBy(lcol, rcol);
    map(groupBy, by => builder = builder.groupBy(by));
    if (callback) builder = callback(builder, lcol, rcol);
    return builder;
}
