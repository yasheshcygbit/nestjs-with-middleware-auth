import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint'
  })
  id: number;

  @Column({
    name: 'email',
    type: 'varchar'
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar'
  })
  password: string;
}