import {Request, Response} from "express"

import {
  Profile,
  Gender,
  Auth,
  Role
} from "src/model"

import { authRepository, profileRepository } from "src/repositories";

class ProfileController {
  create = async (req: Request, res: Response) => {
    const {
      email,
      first_name,
      last_name,
      display_name,
      phone_number,
      date_of_birth,
      nationality,
      gender
    } = req.body;

    const auth = new Auth();

    auth.email = email;
    auth.role = Role.USER;

    const profile = new Profile();

    profile.first_name = first_name;
    profile.last_name = last_name;
    profile.display_name = display_name;
    profile.phone_number = phone_number;
    profile.date_of_birth = date_of_birth;
    profile.nationality = nationality;
    profile.gender = gender;
    profile.auth = auth;

    try {
      await profileRepository.save(profile)
  
      res.sendStatus(200);
    } catch {
      res.sendStatus(400)
    }
  }
}

export default new ProfileController();
