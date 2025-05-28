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

@Entity("propertyReviews")
export class PropertyReview extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "propertyId",
    type: "uuid"
  })
  propertyId: string;

  @Column({
    name: "userId",
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

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  @ManyToOne(() => Property, property => property.id)
  property: Property;
}

export default PropertyReview;
