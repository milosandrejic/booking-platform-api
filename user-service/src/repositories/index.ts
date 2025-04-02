import { dataSource } from "src/db/config";
import {
  Auth,
  Profile
} from "src/model";

export const AuthRepository = dataSource.getRepository(Auth);
export const profileRepository = dataSource.getRepository(Profile)
