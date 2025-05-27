import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne
} from "typeorm";

import Property from "./Property";

@Entity("property_reviews")
export class PropertyReview extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "property_id",
    type: "uuid"
  })
  propertyId: string;

  @Column({
    name: "user_id",
    type: "uuid"
  })
  userId: string;

  @Column({
    type: "int"
  })
  rating: number;

  @Column({
    type: "citext"
  })
  comment: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Property, property => property.id)
  property: Property;
}

export default PropertyReview;
