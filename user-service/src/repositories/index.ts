import { dataSource } from "src/db/config";
import {
  Auth,
  User
} from "src/model";

export const authRepository = dataSource.getRepository(Auth);
export const userRepository = dataSource.getRepository(User)
