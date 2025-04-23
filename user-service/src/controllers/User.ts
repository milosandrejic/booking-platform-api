import {Request, Response} from "express"
import Joi from "joi";
import dayjs from "dayjs";

import {
  User,
  Auth,
  Role
} from "src/model"

import { userRepository } from "src/repositories";

const userSchema = Joi.object({
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

class UserController {
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

    const {error} = userSchema.validate(req.body);

    if (error) {
      res.status(400).send(error);

      return;
    }

    const auth = new Auth();

    auth.email = email;
    auth.role = Role.USER;

    let user = new User();

    user.first_name = first_name;
    user.last_name = last_name;
    user.phone_number = phone_number;
    user.date_of_birth = date_of_birth;
    user.nationality = nationality;
    user.gender = gender;
    user.auth = auth;

    if (display_name) {
      user.display_name = display_name;
    } else {
      user.display_name = `${user.first_name} ${user.last_name}`;
    }

    try {
      user = await userRepository.save(user)
  
      res.send(user);
    } catch {
      res.sendStatus(400)
    }
  }

  update = async (req: Request, res: Response) => {
    let user = await userRepository.findOneBy({id: req.params.id})

    if (!user) {
      res.status(400).send({
        error: "User not found",
      });

      return;
    }

    user = {
      ...user,
      ...req.body,
      id: user.id
    } as User

    const {error} = userSchema.validate(user);

    if (error) {
      res.status(400).send(error);
    }

    user = await userRepository.save(user);

    res.send(user);
  }
}

export default new UserController();
