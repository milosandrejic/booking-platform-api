import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn
} from "typeorm";

import {Auth} from "./auth"

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("citext")
  first_name: string

  @Column("citext")
  last_name: string

  @OneToOne(() => Auth, (auth) => auth.profile)
  @JoinColumn()
  auth: Auth
}