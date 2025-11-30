import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { User } from "src/model";

export enum Role {
  USER = "USER",
  OWNER = "OWNER",
  ADMIN = "ADMIN"
}

@Unique(["email"])
@Entity("auth")
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("citext")
  email: string;

  @Column({
    type: "boolean",
    default: false
  })
  emailVerified: boolean;

  @Column({
    type: "text",
    nullable: true
  })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @Column({
    type: "text",
    nullable: true
  })
  refreshToken: string | null;

  @Column({
    type: "timestamp",
    nullable: true
  })
  refreshTokenExpiry: Date | null;

  @Column({
    type: "integer",
    default: 0
  })
  tokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User)
  user: User;
}
