import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

import PropertyType from "src/types/propertyType";

@Entity("properties")
export class Property extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "ownerId",
    type: "uuid"
  })
  ownerId: string;

  @Column("citext")
  title: string;

  @Column("citext")
  description: string;

  @Column("float")
  price: number;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326
  })
  location: object;

  @Column({
    name: "addressLine",
    type: "citext"
  })
  addressLine: string;

  @Column("citext")
  city: string;

  @Column("citext")
  state: string;

  @Column({
    name: "postalCode",
    type: "citext"
  })
  postalCode: string;

  @Column("citext")
  country: string;

  @Column({
    name: "isActive",
    default: true
  })
  isActive: boolean;

  @Column("citext")
  type: PropertyType;

  @Column({
    type: "jsonb",
    default: "{}"
  })
  facilities: string[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}

export default Property;
