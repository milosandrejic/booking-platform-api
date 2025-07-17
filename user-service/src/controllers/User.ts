import { Request, Response } from "express";

import {
  User,
  Auth,
  Role
} from "src/model";

import { userRepository } from "src/repositories";

class UserController {
  static create = async (req: Request, res: Response) => {
    const {
      email,
      firstName,
      lastName,
      displayName,
      phoneNumber,
      dateOfBirth,
      nationality,
      gender
    } = req.body;

    const auth = new Auth();

    auth.email = email;
    auth.role = Role.USER;

    let user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = dateOfBirth;
    user.nationality = nationality;
    user.gender = gender;
    user.auth = auth;

    if (displayName) {
      user.displayName = displayName;
    } else {
      user.displayName = `${user.firstName} ${user.lastName}`;
    }

    try {
      user = await userRepository.save(user);

      res.send(user);
    } catch {
      res.sendStatus(400);
    }
  };

  static update = async (req: Request, res: Response) => {
    let user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      res.status(400).send({
        error: "User not found"
      });

      return;
    }

    user = {
      ...user,
      ...req.body,
      id: user.id
    } as User;

    user = await userRepository.save(user);

    res.send(user);
  };

  static get = async (req: Request, res: Response) => {
    const user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      res.status(400).send({
        error: "User not found"
      });

      return;
    }

    res.send(user);
  };
}

export default UserController;
