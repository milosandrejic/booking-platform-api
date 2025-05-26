import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "../db/config";
import PropertyReview from "../model/PropertyReview";

export class PropertyReviewRepository {
  private repository: Repository<PropertyReview>;

  constructor() {
    this.repository = dataSource.getRepository(PropertyReview);
  }

  findOneById = async (id: string): Promise<PropertyReview | null> => {
    return this.repository.findOneBy({ id });
  };

  save = async (review: PropertyReview): Promise<PropertyReview> => {
    return this.repository.save(review);
  };

  findOneBy = async (where: FindOptionsWhere<PropertyReview>): Promise<PropertyReview | null> => {
    return this.repository.findOneBy(where);
  };

  findOne = async (where: FindOptionsWhere<PropertyReview>): Promise<PropertyReview | null> => {
    return this.repository.findOne({ where });
  };

  find = async (where: FindOptionsWhere<PropertyReview>): Promise<PropertyReview[]> => {
    return this.repository.find({ where });
  };

  remove = async (review: PropertyReview): Promise<PropertyReview> => {
    return this.repository.remove(review);
  };
}

export default PropertyReviewRepository;
