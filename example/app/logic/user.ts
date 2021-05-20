import { Logic, PandoraLogicRules, RequestMethod } from 'egg-pandora';
import { Exception } from '@dto/base';

export default class extends Logic {

    @Exception
    public async register() {
        const rules: PandoraLogicRules = {
            email: {
                email: true, required: true,
                method: [RequestMethod.POST],
            },
            password: {
                string: true, required: true,
                length: { min: 6, max: 20 },
                method: [RequestMethod.POST],
            },
        };
        return this.validation(rules);
    }

    @Exception
    public async login() {
        const rules: PandoraLogicRules = {
            email: {
                email: true, required: true,
                method: [RequestMethod.POST],
            },
            password: {
                string: true, required: true,
                length: { min: 6, max: 20 },
                method: [RequestMethod.POST],
            },
        };
        return this.validation(rules);
    }
}
