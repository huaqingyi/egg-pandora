import { Controller } from 'egg';
import { IsObject, IsString, IsInt, Min, Max, Dto, JSONSchema } from 'egg-pandora';

export function Exception(_t: object, _p: string, descr: TypedPropertyDescriptor<Function>) {
    const action = descr.value;
    descr.value = function (this: Controller, ...props) {
        let result;
        let resp = new ResponseDto();
        try {
            result = action?.apply(this, props);
        } catch (err) {
            resp.errmsg = err.message;
            resp.error = err;
            resp.errno = 1000;
            this.ctx.body = resp;
        }
        if (result.then) {
            result.then(body => {
                resp.data = body;
                this.ctx.body = resp;
            });
        } else {
            resp.data = result;
            this.ctx.body = resp;
        }
    }
}

export function PhoneNumber(target: Object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(11)(target, propertyKey);
    Max(11)(target, propertyKey);
}

export function UserID(target: Object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(0)(target, propertyKey);
    Max(11)(target, propertyKey);
}

export function TimeStamp(target: Object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(13)(target, propertyKey);
    Max(13)(target, propertyKey);
}

export class ResponseDto<T = any> extends Dto {

    @IsObject()
    @JSONSchema({ description: `错误详情 .`, example: { xx: 'xxxx .' } })
    public error!: object;

    @IsString()
    @JSONSchema({ description: `错误信息 .`, example: '错误信息 .' })
    public errmsg!: string;

    @IsInt()
    @JSONSchema({ description: `错误码 .`, example: 'number' })
    public errno!: number;

    public data?: T;

    constructor() {
        super();
        this.errno = 0;
        this.errmsg = '';
        this.error = {};
    }
}
