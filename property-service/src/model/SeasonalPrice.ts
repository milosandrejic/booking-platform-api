import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "typeorm";
import Property from "src/model/Property";

@Entity("seasonal_prices")
export class SeasonalPrice extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "propertyId",
    type: "uuid"
  })
  propertyId: string;

  @Column({
    name: "startDate",
    type: "date"
  })
  startDate: Date;

  @Column({
    name: "endDate",
    type: "date"
  })
  endDate: Date;

  @Column({
    name: "pricePerNight",
    type: "decimal",
    precision: 10,
    scale: 2
  })
  pricePerNight: number;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;

  @ManyToOne(() => Property)
  @JoinColumn({ name: "propertyId" })
  property: Property;
}

export default SeasonalPrice;
