import { Logic, PandoraLogicRules, RequestMethod } from 'egg-pandora';
import { Context } from 'egg';

export default class extends Logic {

    constructor(ctx: Context) {
        super(ctx);
        console.log('logic');
    }

    public async index() {
        const rules: PandoraLogicRules = {
            name: {
                string: true,
                required: true,
                method: [RequestMethod.POST],
            }
        };
        const valid = this.validate(rules);
        console.log(111, valid);
        this.ctx.body = `error`;
        return false;
    }
}
