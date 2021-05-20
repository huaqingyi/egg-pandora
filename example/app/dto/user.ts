import { IsNotEmpty, ValidateNested } from 'egg-pandora';
import { ResponseDto } from './base';
import { User } from '@entity/user';

export class UserResponseDto extends ResponseDto {

    @ValidateNested()
    @IsNotEmpty()
    public data: User;
}
