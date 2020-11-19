import {
    Contains, IsInt, Length, IsEmail, IsFQDN, Dto,
    IsDate, Min, Max, ValidateNested, IsString, IsEmpty,
} from 'egg-pandora';

export class Test1 extends Dto {

    @Length(10, 20)
    public title!: string;

    @Contains('hello')
    public text!: string;

    @IsInt()
    @Min(0)
    @Max(10)
    public rating!: number;

    @IsEmail()
    public email!: string;

    @IsFQDN()
    public site!: string;

    @IsDate()
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
