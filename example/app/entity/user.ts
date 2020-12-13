import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TypeOrm } from 'egg-pandora';

@Entity()
export class User extends TypeOrm<User> {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    public async queryAll() {
        return this.findAndCount();
    }
}
