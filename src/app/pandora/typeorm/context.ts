import { getConnection } from 'typeorm';
import { TypeOrm, join } from './orm';
import { isString } from 'lodash';

export const TypeORM = {
    repo<E extends (new (...props: any) => TypeOrm<E>)>(...props: any[]) {
        const [Entity, dbName] = props;
        if (!dbName || isString(dbName)) {
            const repository = getConnection(dbName).getRepository(Entity);
            return new Proxy(repository, {
                get(target: any, key: string) {
                    if (target[key]) { return target[key]; }
                    return Entity.prototype[key].bind(target);
                },
                set(target: any, key: string, value: any) {
                    target[key] = value;
                    return true;
                }
            });
        }
        return (join as any)(...props);
    },
};
