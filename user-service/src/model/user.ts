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
    name: "first_name",
    type: "citext",
    nullable: true
  })
  firstName: string;

  @Column({
    name: "last_name",
    type: "citext",
    nullable: true
  })
  lastName: string;

  @Column({
    name: "display_name",
    type: "citext",
    nullable: true
  })
  displayName: string;

  @Column({
    name: "phone_number",
    type: "citext",
    nullable: true
  })
  phoneNumber: string;

  @Column({
    name: "date_of_birth",
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
  @JoinColumn({ name: "auth_id" })
  auth: Auth;
}
