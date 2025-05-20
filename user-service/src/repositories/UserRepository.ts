import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "src/db/config";
import { User } from "src/model";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { auth: { email } },
      relations: ["auth"]
    });
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.repository.findOneBy(where);
  }

  async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    return this.repository.findOne({ where });
  }

  async find(where: FindOptionsWhere<User>): Promise<User[]> {
    return this.repository.find({ where });
  }

  async remove(user: User): Promise<User> {
    return this.repository.remove(user);
  }

  async findOneWithAuth(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["auth"]
    });
  }
}
