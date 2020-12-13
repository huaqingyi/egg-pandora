import { Logic } from 'egg-pandora';
import { Context } from 'egg';

export default class extends Logic {

    constructor(ctx: Context) {
        super(ctx);
        console.log('logic');
    }

    public async add() {
        console.log(11111111111);
    }
}
