import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "src/db/config";
import { Booking } from "src/model";
import BookingStatus from "src/types/bookingStatus";

export class BookingRepository {
  private repository: Repository<Booking>;

  constructor() {
    this.repository = dataSource.getRepository(Booking);
  }

  save = async (booking: Booking): Promise<Booking> => {
    return this.repository.save(booking);
  };

  findOneBy = async (where: FindOptionsWhere<Booking>): Promise<Booking | null> => {
    return this.repository.findOneBy(where);
  };

  findOne = async (where: FindOptionsWhere<Booking>): Promise<Booking | null> => {
    return this.repository.findOne({ where });
  };

  find = async (where: FindOptionsWhere<Booking>): Promise<Booking[]> => {
    return this.repository.find({ where });
  };

  findByUserId = async (userId: string): Promise<Booking[]> => {
    return this.repository.find({ where: { userId } });
  };

  findByPropertyId = async (propertyId: string): Promise<Booking[]> => {
    return this.repository.find({ where: { propertyId } });
  };

  remove = async (booking: Booking): Promise<Booking> => {
    return this.repository.remove(booking);
  };

  cancelBooking = async (id: string): Promise<Booking | null> => {
    await this.repository.update(id, { status: BookingStatus.CANCELLED });
    return await this.findOneBy({ id });
  };
}
