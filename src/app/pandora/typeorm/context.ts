import { getConnection } from 'typeorm';
import { TypeOrm } from './orm';

export const TypeORM = {
    repo<E extends (new (...props: any) => TypeOrm<E>)>(
        Entity: E, dbName?: string,
    ) {
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
    },
};
