import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "src/db/config";
import { User } from "src/model";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  findOneByEmail = async (email: string): Promise<User | null> => {
    return this.repository.findOne({
      where: { auth: { email } },
      relations: ["auth"]
    });
  };

  save = async (user: User): Promise<User> => {
    return this.repository.save(user);
  };

  findOneBy = async (where: FindOptionsWhere<User>): Promise<User | null> => {
    return this.repository.findOneBy(where);
  };

  findOne = async (where: FindOptionsWhere<User>): Promise<User | null> => {
    return this.repository.findOne({ where });
  };

  find = async (where: FindOptionsWhere<User>): Promise<User[]> => {
    return this.repository.find({ where });
  };

  remove = async (user: User): Promise<User> => {
    return this.repository.remove(user);
  };

  findOneWithAuth = async (id: string): Promise<User | null> => {
    return this.repository.findOne({
      where: { id },
      relations: ["auth"]
    });
  };

  findOneByAuthId = async (authId: string): Promise<User | null> => {
    return this.repository.findOne({
      where: { auth: { id: authId } },
      relations: ["auth"]
    });
  };
}
