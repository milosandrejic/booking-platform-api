import {Request, Response} from "express"

import {
  User,
  Auth,
  Role
} from "src/model"

import { userRepository } from "src/repositories";

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

    user = await userRepository.save(user);

    res.send(user);
  }

  get = async (req: Request, res: Response) => {
    const user = await userRepository.findOneBy({id: req.params.id});

    if (!user) {
      res.status(400).send({
        error: "User not found"
      })

      return;
    }

    res.send(user);
  }
}

export default new UserController();
