import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "src/db/config";
import { Auth } from "src/model";

export class AuthRepository {
  private repository: Repository<Auth>;

  constructor() {
    this.repository = dataSource.getRepository(Auth);
  }

  async findOneByEmail(email: string): Promise<Auth | null> {
    return this.repository.findOneBy({ email });
  }

  async save(auth: Auth): Promise<Auth> {
    return this.repository.save(auth);
  }

  async findOneBy(where: FindOptionsWhere<Auth>): Promise<Auth | null> {
    return this.repository.findOneBy(where);
  }

  async findOne(where: FindOptionsWhere<Auth>): Promise<Auth | null> {
    return this.repository.findOne({ where });
  }

  async find(where: FindOptionsWhere<Auth>): Promise<Auth[]> {
    return this.repository.find({ where });
  }

  async remove(auth: Auth): Promise<Auth> {
    return this.repository.remove(auth);
  }
}
