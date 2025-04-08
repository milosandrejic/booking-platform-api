import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  Unique,
  CreateDateColumn,
} from "typeorm";

import { Profile } from "src/model";

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

  @CreateDateColumn()
  created_at: Date

  @OneToOne(() => Profile)
  profile: Profile;
}