import { Controller } from 'egg';
import { IsString, IsInt, Min, Max, Dto, JSONSchema, IsNotEmpty } from 'egg-pandora';
import { map } from 'lodash';

export function PhoneNumber(target: object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(11)(target, propertyKey);
    Max(11)(target, propertyKey);
}

export function UserID(target: object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(0)(target, propertyKey);
    Max(11)(target, propertyKey);
}

export function TimeStamp(target: object, propertyKey: string | symbol) {
    IsInt()(target, propertyKey);
    Min(13)(target, propertyKey);
    Max(13)(target, propertyKey);
}

export class ResponseDto extends Dto {

    @IsNotEmpty()
    @JSONSchema({ description: '错误详情 .', example: { xx: 'xxxx .' } })
    public error!: object | string;

    @IsString()
    @JSONSchema({ description: '错误信息 .', example: '错误信息 .' })
    public errmsg!: string;

    @IsInt()
    @JSONSchema({ description: '错误码 .', example: 'number' })
    public errno!: number;

    @IsNotEmpty()
    public data: any;

    constructor() {
        super();
        this.errno = 0;
        this.errmsg = '';
        this.error = {};
        this.data = {};
    }
}

export function Exception(_t: object, _p: string, descr: PropertyDescriptor) {
    const action = descr.value;
    descr.value = async function wrapper(this: Controller, ...props) {
        const resp = new ResponseDto();
        try {
            resp.data = await action?.apply(this, props);
            this.ctx.body = resp;
            return resp;
        } catch (err) {
            if (!err.message) {
                err.message = map(err, (m, k) => `${k}: ${m}`).join('\n');
            }
            resp.errmsg = err.message;
            delete err.message;
            resp.error = err.stack || err;
            resp.errno = 1000;
            this.ctx.body = resp;
            return false;
        }
    };
}
