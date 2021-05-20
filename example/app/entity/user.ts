import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PColumn, IsDate, IsEmail, IsInt, Length, TypeOrm } from 'egg-pandora';

export enum UserType {
    WX = 'WX', QQ = 'QQ', DEFAULT = 'DEFAULT',
}

@Entity()
export class User extends TypeOrm<User> {

    @IsInt()
    @PColumn(PrimaryGeneratedColumn, { comment: '用户 ID' })
    public id!: number;

    @IsEmail()
    @PColumn(Column, { type: 'varchar', length: 50, nullable: false, comment: '邮箱' })
    public email!: string;

    @Column({ type: 'varchar', length: 100, nullable: true, comment: '密码' })
    public password!: string;

    @Length(1, 10)
    @PColumn(Column, {
        length: 10, nullable: false, default: UserType.DEFAULT,
        type: 'char', comment: '平台 QQ WX 等 默认 defaut',
    })
    public type!: string;

    @IsInt()
    @PColumn(Column, { type: 'int', nullable: false, default: 0, comment: '是否激活' })
    public isActived!: number;

    @IsDate()
    @PColumn(CreateDateColumn, { type: 'timestamp', nullable: false, comment: '创建时间' })
    public createdAt!: Date;

    @IsDate()
    @PColumn(UpdateDateColumn, { type: 'timestamp', nullable: false, comment: '修改时间', update: true })
    public updatedAt!: Date;
}
