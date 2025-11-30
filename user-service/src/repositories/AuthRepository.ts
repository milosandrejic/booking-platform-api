import { Repository, FindOptionsWhere } from "typeorm";
import { dataSource } from "src/db/config";
import { Auth } from "src/model";

export class AuthRepository {
  private repository: Repository<Auth>;

  constructor() {
    this.repository = dataSource.getRepository(Auth);
  }

  findOneByEmail = async (email: string): Promise<Auth | null> => {
    return this.repository.findOneBy({ email });
  };

  save = async (auth: Auth): Promise<Auth> => {
    return this.repository.save(auth);
  };

  findOneBy = async (where: FindOptionsWhere<Auth>): Promise<Auth | null> => {
    return this.repository.findOneBy(where);
  };

  findOne = async (where: FindOptionsWhere<Auth>): Promise<Auth | null> => {
    return this.repository.findOne({ where });
  };

  find = async (where: FindOptionsWhere<Auth>): Promise<Auth[]> => {
    return this.repository.find({ where });
  };

  remove = async (auth: Auth): Promise<Auth> => {
    return this.repository.remove(auth);
  };

  saveRefreshToken = async (
    userId: string,
    hashedToken: string,
    expiry: Date
  ): Promise<void> => {
    await this.repository.update(userId, {
      refreshToken: hashedToken,
      refreshTokenExpiry: expiry
    });
  };

  clearRefreshToken = async (userId: string): Promise<void> => {
    await this.repository.update(userId, {
      refreshToken: null,
      refreshTokenExpiry: null
    });
  };

  incrementTokenVersion = async (userId: string): Promise<void> => {
    await this.repository.increment({ id: userId }, "tokenVersion", 1);
  };
}
