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
    name: "owner_id",
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
    name: "address_line",
    type: "citext"
  })
  addressLine: string;

  @Column("citext")
  city: string;

  @Column("citext")
  state: string;

  @Column({
    name: "postal_code",
    type: "citext"
  })
  postalCode: string;

  @Column("citext")
  country: string;

  @Column({
    name: "is_active",
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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

export default Property;
