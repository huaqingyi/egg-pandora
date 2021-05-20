import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';
import { Exception } from '@dto/base';
import '@dto/user';

/**
 * @controller user
 */
@RestController
export default class extends Controller {

    /**
     * @summary 用户注册
     * @router POST /user/register
     * @request body string email 邮箱地址 2304816231@qq.com
     * @request body string password 密码 123456
     * @response 200 UserResponseDto
     * @apikey
     */
    @Exception
    @RequestMapping({ path: '/register', methods: [RequestMethod.POST], secret: false })
    public async register() {
        return await this.service.user.addUser(this.ctx.post());
    }

    /**
     * @summary 用户注册
     * @router POST /user/login
     * @request body string email 邮箱地址 2304816231@qq.com
     * @request body string password 密码 123456
     * @response 200 UserResponseDto
     * @apikey
     */
    @Exception
    @RequestMapping({ path: '/login', methods: [RequestMethod.POST], secret: false })
    public async login() {
        const user = { ...await this.service.user.verify(this.ctx.post()) };
        delete (user as any).password;
        const token = this.app.jwt.sign(user, this.app.config.jwt.secret);
        this.ctx.set('authorization', token);
        return user;
    }

    /**
     * @summary 测试接口资源
     * @router POST /user/index/{id}/{uid}
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
    @Exception
    @RequestMapping({ path: 'index/:id/:uid', methods: [RequestMethod.POST] })
    public async index() {
        console.log('path', this.ctx.params);
        console.log('query', this.ctx.request.query);
        console.log('header', this.ctx.headers);
        console.log('body', this.ctx.request.body);
        console.log('file', this.ctx.request.files);
        return {};
    }
}
