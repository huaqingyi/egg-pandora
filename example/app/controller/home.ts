import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';
import { HomeDataDto } from '../dto/home';

/**
 * @controller home
 */
@RestController
export default class extends Controller {

    /**
     * @summary 测试
     * @router POST /home/test
     * @request query string test 测试
     * @request body string name 名字
     * @consumes multipart/form-data
     * @response default HomeDataDto
     * @response 200 Test1
     * @apikey
     */
    @RequestMapping({ path: 'test', methods: [RequestMethod.POST] })
    public async test() {
        console.log('query', this.ctx.request.query);
        console.log('body', this.ctx.request.body);
        this.ctx.body = {};
    }

    /**
     * @summary 创建资源
     * @router POST /home/index/{id}/{uid}
     * @request path string id ID
     * @request path string uid UID
     * @request query string test 测试
     * @request query string test1 测试1
     * @request formdata file file 文件 false
     * @request formdata file file1 文件1 false
     * @request body string name 名字
     * @request body string age 年龄
     * @consumes multipart/form-data
     * @apikey
     */
    @RequestMapping({ path: 'index/:id/:uid', methods: [RequestMethod.POST] })
    public async index() {
        console.log('path', this.ctx.params);
        console.log('query', this.ctx.request.query);
        console.log('header', this.ctx.request.headers);
        console.log('body', this.ctx.request.body);
        console.log('file', this.ctx.request.files);
        const { ctx } = this;
        console.log(await ctx.vaildAOP(HomeDataDto, {}));

        // ctx.body = await ctx.service.test.sayHi('egg');
        ctx.body = await ctx.service.test.test();
    }
}
