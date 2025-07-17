import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

import BookingStatus from "src/types/bookingStatus";

@Entity("bookings")
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "userId",
    type: "uuid"
  })
  userId: string;

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
    name: "totalPrice",
    type: "float"
  })
  totalPrice: number;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @CreateDateColumn({ name: "createdAt" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt: Date;
}
