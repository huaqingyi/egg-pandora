import { PandoraForm } from '../pandora';
import { AOP } from '../pandora/aopImpl/aop';
import { TypeORM } from '../pandora/typeorm';

export default {
    ...AOP,
    ...PandoraForm,
    ...TypeORM,
};