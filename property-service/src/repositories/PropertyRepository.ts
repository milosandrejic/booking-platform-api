import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "../db/config";
import Property from "../model/Property";

export class PropertyRepository {
  private repository: Repository<Property>;

  constructor() {
    this.repository = dataSource.getRepository(Property);
  }

  findOneById = async (id: string): Promise<Property | null> => {
    return this.repository.findOneBy({ id });
  };

  save = async (property: Property): Promise<Property> => {
    return this.repository.save(property);
  };

  findOneBy = async (where: FindOptionsWhere<Property>): Promise<Property | null> => {
    return this.repository.findOneBy(where);
  };

  findOne = async (where: FindOptionsWhere<Property>): Promise<Property | null> => {
    return this.repository.findOne({ where });
  };

  find = async (where: FindOptionsWhere<Property>): Promise<Property[]> => {
    return this.repository.find({ where });
  };

  remove = async (property: Property): Promise<Property> => {
    return this.repository.remove(property);
  };
}

export default PropertyRepository;
