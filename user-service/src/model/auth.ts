import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./profile";

@Unique(["email"])
@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("citext")
  email: string

  @Column("text")
  password: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToOne(() => Profile, (profile) => profile.auth)
  profile: Profile;
}