import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "typeorm";
import Property from "src/model/Property";

@Entity("property_prices")
export class PropertyPrice extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "propertyId",
    type: "uuid"
  })
  propertyId: string;

  @Column({
    name: "basePricePerNight",
    type: "decimal",
    precision: 10,
    scale: 2
  })
  basePricePerNight: number;

  @Column({
    name: "weekendPrice",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true
  })
  weekendPrice: number;

  @Column({
    name: "cleaningFee",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0
  })
  cleaningFee: number;

  @Column({
    name: "serviceFeePercent",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0
  })
  serviceFeePercent: number;

  @Column({
    type: "varchar",
    length: 3,
    default: "EUR"
  })
  currency: string;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  @ManyToOne(() => Property)
  @JoinColumn({ name: "propertyId" })
  property: Property;
}

export default PropertyPrice;
