import { dataSource } from "src/db/config";
import {
  Auth,
  Profile
} from "src/model";

export const authRepository = dataSource.getRepository(Auth);
export const profileRepository = dataSource.getRepository(Profile)
