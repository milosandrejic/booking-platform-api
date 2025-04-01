import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity
} from "typeorm";

@Entity()
export default class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("citext")
  first_name: string

  @Column("citext")
  last_name: string

  @Column("citext")
  email: string

  @Column("text")
  password: string
}