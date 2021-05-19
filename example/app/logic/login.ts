import { Logic, PandoraLogicRules, RequestMethod } from 'egg-pandora';
import { Exception } from '../dto/base';
// import { LoginResponseDto } from '../dto/login';

export default class extends Logic {
    
    @Exception
    public async login() {
        const rules: PandoraLogicRules = {
            telephone: {
                string: true, required: true,
                method: [RequestMethod.POST],
            },
            password: {
                string: true, required: true,
                method: [RequestMethod.POST],
            },
        };
        const valid = this.validation(rules);
        return valid;
    }
}
