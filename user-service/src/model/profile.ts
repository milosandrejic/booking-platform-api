import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn
} from "typeorm";

import { Auth } from "src/model"

export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

@Entity("profile")
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "citext",
    nullable: true
  })
  first_name: string

  @Column({
    type: "citext",
    nullable: true
  })
  last_name: string

  @Column({
    type: "citext",
    nullable: true
  })
  display_name: string

  @Column({
    type: "citext",
    nullable: true
  })
  phone_number: string

  @Column({
    type: "timestamp without time zone",
    nullable: true
  })
  date_of_brith: Date

  @Column({
    type: "citext",
    nullable: true
  })
  nationality: string

  @Column({
    type: "enum",
    enum: Gender
  })
  gender: Gender

  @OneToOne(
    () => Auth, (auth) => auth.profile,
    {
      cascade: ["remove"]
    },
  )
  @JoinColumn()
  auth: Auth
}