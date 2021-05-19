import { Controller } from 'egg';
import { IsObject, IsString, IsInt, Min, Max, Dto, JSONSchema } from 'egg-pandora';

export function Exception(_t: object, _p: string, descr: PropertyDescriptor) {
    const action = descr.value;
    descr.value = async function (this: Controller, ...props) {
        let resp = new ResponseDto();
        try {
            resp.data = await action?.apply(this, props);
            this.ctx.body = resp;
        } catch (err) {
            resp.errmsg = err.message;
            resp.error = err;
            resp.errno = 1000;
            this.ctx.body = resp;
            return false;
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
