import { IsNotEmpty, JSONSchema, Length, ValidateNested } from 'egg-pandora';
import { PhoneNumber, UserID, TimeStamp, ResponseDto } from './base';

export class UserInfo {

    @UserID
    @JSONSchema({ description: '用户 ID .', example: 1 })
    public id!: number;

    @PhoneNumber
    @JSONSchema({ description: '账户 .', example: '18900000000' })
    public telephone!: number;

    @Length(4, 20)
    @JSONSchema({ description: '昵称 .', example: '管理员 .' })
    public username!: string;

    @TimeStamp
    @JSONSchema({ description: '创建时间 .', example: Date.now() })
    public created_at!: number;

    @TimeStamp
    @JSONSchema({ description: '昵称 .', example: Date.now() })
    public updated_at!: number;
}

export class LoginResponseDto extends ResponseDto<UserInfo> {
    @ValidateNested()
    @IsNotEmpty()
    public data!: UserInfo;
}
