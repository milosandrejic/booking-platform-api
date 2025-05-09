import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  Unique,
  CreateDateColumn,
} from "typeorm";

import { User } from "src/model";

export enum Role {
  USER = "USER",
  CLIENT = "CLIENT",
  ADMIN = "ADMIN"
}

@Unique(["email"])
@Entity("auth")
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("citext")
  email: string

  @Column({
    type: "boolean",
    default: false,
  })
  email_verified: boolean

  @Column({
    type: "text",
    nullable: true,
  })
  password: string

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  role: Role

  @Column({
    type: "text",
    nullable: true,
  })
  access_token: string

  @CreateDateColumn()
  created_at: Date

  @OneToOne(() => User)
  user: User;
}