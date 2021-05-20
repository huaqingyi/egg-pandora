import { Context } from 'egg';
import { ResponseDto } from '@dto/base';

export default () => {
    return async function exception(ctx: Context, next) {
        const resp = new ResponseDto();
        try {
            await next();
        } catch (err) {
            resp.errmsg = err.message;
            resp.error = err;
            resp.errno = 1000;
            ctx.body = resp;
            return false;
        }
    };
};
