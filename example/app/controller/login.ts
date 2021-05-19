import { Controller } from 'egg';
import { RequestMapping, RequestMethod, RestController } from 'egg-pandora';
import { Exception } from '../dto/base';

/**
 * @controller login
 */
@RestController
export default class extends Controller {

    /**
     * @summary 登录
     * @router POST /login
     * @request body number telephone 电话号码 18900000000
     * @request body string password 密码
     * @response 200 LoginResponseDto
     * @apikey
     */
    @Exception
    @RequestMapping({ path: '/', methods: [RequestMethod.POST], secret: false })
    public async login() {
        console.log(1111, this.ctx.post());
        this.ctx.body = {};
    }
}
