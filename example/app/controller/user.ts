import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';

@RestController('/users')
export default class extends Controller {

    @RequestMapping
    public async add() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi('egg');
    }

    @RequestMapping({ path: '/test1', methods: [RequestMethod.GET] })
    public async test() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi('egg');
    }
}
