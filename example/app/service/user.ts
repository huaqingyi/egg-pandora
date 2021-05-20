import { Service } from 'egg';
import { User } from '@entity/user';
import { createHash } from 'crypto';

/**
 * User Service
 */
export default class extends Service {

    public md5(str: string) {
        const md5 = createHash('md5');
        return md5.update(str).digest('hex');
    }

    public async addUser(data: User) {
        data.password = this.md5(data.password);
        return this.ctx.repo(User).save(data);
    }

    public async verify(data: User) {
        const [user] = await this.ctx.repo(User).find({ email: data.email });
        if (!user) throw new Error('用户名错误 .');
        if (user.password === this.md5(data.password)) {
            return user;
        }
        throw new Error('密码错误 .');
    }
}
