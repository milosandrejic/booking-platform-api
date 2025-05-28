import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn
} from "typeorm";

import { Auth } from "src/model";

export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "firstName",
    type: "citext",
    nullable: true
  })
  firstName: string;

  @Column({
    name: "lastName",
    type: "citext",
    nullable: true
  })
  lastName: string;

  @Column({
    name: "displayName",
    type: "citext",
    nullable: true
  })
  displayName: string;

  @Column({
    name: "phoneNumber",
    type: "citext",
    nullable: true
  })
  phoneNumber: string;

  @Column({
    name: "dateOfBirth",
    type: "timestamp without time zone",
    nullable: true
  })
  dateOfBirth: Date;

  @Column({
    name: "nationality",
    type: "citext",
    nullable: true
  })
  nationality: string;

  @Column({
    name: "gender",
    type: "enum",
    enum: Gender
  })
  gender: Gender;

  @OneToOne(() => Auth, {
    cascade: ["remove", "insert"],
    eager: true
  })
  @JoinColumn({ name: "authId" })
  auth: Auth;
}
