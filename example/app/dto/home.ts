import {
    Contains, IsInt, Length, IsEmail, IsFQDN, Dto,
    IsDate, Min, Max, ValidateNested, IsString, IsEmpty, JSONSchema,
} from 'egg-pandora';

export class Test1 extends Dto {

    @Length(10, 20)
    @JSONSchema({ description: '标题', example: '测试' })
    public title!: string;

    @Contains('hello')
    @JSONSchema({ description: '字符', example: 'hello' })
    public text!: string;

    @IsInt()
    @Min(0)
    @Max(10)
    @JSONSchema({ description: '测试 Rating', example: 0 })
    public rating!: number;

    @IsEmail()
    @JSONSchema({ description: '邮箱', example: 'test@admin.com' })
    public email!: string;

    @IsFQDN()
    @JSONSchema({ description: '地址', example: '测试地址' })
    public site!: string;

    @IsDate()
    @JSONSchema({ description: '创建时间', example: (new Date) })
    public createDate!: Date;
}

export class HomeDataDto extends Dto {

    @IsString()
    public error!: string;
    @IsInt()
    public errno!: number;

    @ValidateNested()
    @IsEmpty()
    public data?: Test1;
}
