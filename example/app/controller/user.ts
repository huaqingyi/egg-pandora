import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';
import { User } from '../entity/user';

@RestController('/users')
export default class extends Controller {

    @RequestMapping
    public async add() {
        const { ctx } = this;
        console.log(await ctx.repo(User).count());
        console.log(await ctx.repo(User).queryAll());
        ctx.body = await ctx.service.test.sayHi('egg');
    }

    @RequestMapping({ path: '/test1', methods: [RequestMethod.GET] })
    public async test() {
        const { ctx } = this;
        ctx.body = await ctx.service.test.sayHi('egg');
    }
}
