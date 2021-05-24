import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PColumn, IsDate, IsEmail, IsInt, TypeOrm, IsString, IsEnum, join, JoinType } from 'egg-pandora';
import { UserInfo } from './user.info';
// import { map, isArray, groupBy } from 'lodash';

export enum UserType {
    WX = 'WX', QQ = 'QQ', DEFAULT = 'DEFAULT',
}

export enum IsActionType {
    FALSE = 0, TRUE = 1,
}

@Entity()
export class User extends TypeOrm<User> {

    @IsInt()
    @PColumn(PrimaryGeneratedColumn, { comment: '用户 ID' })
    public id!: number;

    @IsEmail()
    @PColumn(Column, { type: 'varchar', unique: true, length: 50, nullable: false, comment: '邮箱' })
    public email!: string;

    @IsString()
    @Column({ type: 'varchar', length: 100, nullable: true, comment: '密码' })
    public password!: string;

    @IsEnum(UserType)
    @Column({ length: 10, nullable: false, default: UserType.DEFAULT, type: 'char', comment: '平台 QQ WX 等 默认 defaut' })
    public type!: string;

    @IsEnum(IsActionType)
    @PColumn(Column, { type: 'boolean', nullable: false, default: 0, comment: '是否激活' })
    public isActived!: boolean;

    @IsEnum(IsActionType)
    @PColumn(Column, { type: 'boolean', nullable: false, default: 0, comment: '管理员' })
    public isSuper!: boolean;

    @IsDate()
    @PColumn(CreateDateColumn, { type: 'timestamp', nullable: false, comment: '创建时间' })
    public createdTime!: Date;

    @IsDate()
    @PColumn(UpdateDateColumn, { type: 'timestamp', nullable: false, comment: '修改时间', update: true, name: 'updated_time' })
    public updatedTime!: Date;

    // public async findUsers() {
    //     console.log(map(getManager().getRepository(User).metadata.columns, ({ databaseName, propertyName }) => {
    //         return databaseName || propertyName;
    //     }), map(getManager().getRepository(UserInfo).metadata.columns, ({ databaseName, propertyName }) => {
    //         return databaseName || propertyName;
    //     }));
    //     return await this.createQueryBuilder().leftJoinAndSelect(UserInfo, 'ui', [
    //         'ui.userId = user.id'
    //     ].join(' ')).select([
    //         'user.id as id',
    //         'user.email as email',
    //         'user.type as type',
    //         'user.isActived as isActived',
    //         'user.isSuper as isSuper',
    //         'ui.nickname as nickname',
    //     ].join(',')).getRawMany();
    // }

    public async findUsers() {
        return await join(User, UserInfo, {
            type: JoinType.INNER,
            on: [e => e.id, e => e.user],
            groupBy: (user, _info) => [user.id],
            fields: (user, info) => ({
                [user.id]: 'id',
                [user.email]: 'email',
                [String(user.isActived)]: 'isActived',
                [String(user.isSuper)]: 'isSuper',
                [info.nickname]: { field: 'nickname', array: true },
            }),
        }, (db, user, info)=>{
            console.log(db, user, info);
            return db;
        }).getRawMany();
    }
}
