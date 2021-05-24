import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PColumn, IsDate, IsInt, TypeOrm } from 'egg-pandora';
import { IsString } from 'class-validator';
import { User } from './user';

@Entity()
export class UserInfo extends TypeOrm<UserInfo> {

    @IsInt()
    @PColumn(PrimaryGeneratedColumn, { comment: '用户详情 ID' })
    public id!: number;

    @IsString()
    @ManyToOne(() => User, user => user.id)
    @PColumn(JoinColumn, { type: 'varchar', nullable: false, default: 0, comment: '管理员' })
    public user!: User;

    @IsString()
    @PColumn(Column, { type: 'varchar', nullable: false, default: 0, comment: '昵称' })
    public nickname!: string;

    @IsDate()
    @PColumn(CreateDateColumn, { type: 'timestamp', nullable: false, comment: '创建时间' })
    public createdTime!: Date;

    @IsDate()
    @PColumn(UpdateDateColumn, { type: 'timestamp', nullable: false, comment: '修改时间', update: true })
    public updatedTime!: Date;
}
