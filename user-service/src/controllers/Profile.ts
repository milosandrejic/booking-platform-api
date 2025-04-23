import {Request, Response} from "express"
import Joi from "joi";
import dayjs from "dayjs";

import {
  Profile,
  Gender,
  Auth,
  Role
} from "src/model"

import { profileRepository } from "src/repositories";

const profileSchema = Joi.object({
  email: Joi
    .string()
    .email()
    .trim()
    .required(),
  first_name: Joi
    .string()
    .trim()
    .required(),
  last_name: Joi
    .string()
    .trim()
    .required(),
  phone_number: Joi
    .string()
    .trim()
    .required(),
  date_of_birth: Joi
    .date()
    .min(dayjs().subtract(18, "years").toDate())
    .required(),
  nationality: Joi
    .string()
    .trim()
    .required()
});

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

    const {error} = profileSchema.validate({email, first_name, last_name});

    if (error) {
      res.status(400).send(error);

      return;
    }

    const auth = new Auth();

    auth.email = email;
    auth.role = Role.USER;

    let profile = new Profile();

    profile.first_name = first_name;
    profile.last_name = last_name;
    profile.phone_number = phone_number;
    profile.date_of_birth = date_of_birth;
    profile.nationality = nationality;
    profile.gender = gender;
    profile.auth = auth;

    if (display_name) {
      profile.display_name = display_name;
    } else {
      profile.display_name = `${profile.first_name} ${profile.last_name}`;
    }

    try {
      profile = await profileRepository.save(profile)
  
      res.send(profile);
    } catch {
      res.sendStatus(400)
    }
  }

  update = async (req: Request, res: Response) => {
    let profile = await profileRepository.findOneBy({id: req.params.id})

    if (!profile) {
      res.status(400).send({
        error: "Profile not found",
      });

      return;
    }

    profile = {
      ...profile,
      ...req.body,
      id: profile.id
    } as Profile

    const {error} = profileSchema.validate(profile);

    if (error) {
      res.status(400).send(error);
    }

    profile = await profileRepository.save(profile);

    res.send(profile);
  }
}

export default new ProfileController();
