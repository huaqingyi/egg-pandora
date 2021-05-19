import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';
import { User } from '../entity/user';

@RestController('')
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

    @RequestMapping
    public async logout(){
        this.ctx.logout();
    }

    @RequestMapping
    public async render() {
        const ctx = this.ctx;

        if (ctx.isAuthenticated()) {
            ctx.body = `<div>
            <h2>${ctx.path}</h2>
            <hr>
            Logined user: <img src="${ctx.user.photo}"> ${ctx.user.displayName} / ${ctx.user.id} | <a href="/user/logout">Logout</a>
            <pre><code>${JSON.stringify(ctx.user, null, 2)}</code></pre>
            <hr>
            <a href="/">Home</a> | <a href="/user">User</a>
          </div>`;
        } else {
            ctx.session.returnTo = ctx.path;
            ctx.body = `
            <div>
              <h2>${ctx.path}</h2>
              <hr>
              Login with
              <a href="/passport/github">Github</a> | <a href="/passport/weixin">微信</a>
              <hr>
              <a href="/">Home</a> | <a href="/user">User</a>
            </div>
          `;
        }
    }
}
