import { Request, Response } from "express";

import {
  User,
  Auth,
  Role
} from "src/model";

import { userRepository, authRepository } from "src/repositories";
import { PasswordUtils } from "src/utils/passwordUtils";

class UserController {
  static createCustomer = async (req: Request, res: Response) => {
    const {
      email,
      password,
      firstName,
      lastName,
      displayName,
      phoneNumber,
      dateOfBirth,
      nationality,
      gender
    } = req.body;

    const auth = new Auth();

    const hashedPassword = await PasswordUtils.hash(password);

    auth.email = email;
    auth.password = hashedPassword;
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

  static createOwner = async (req: Request, res: Response) => {
    const {
      email,
      password,
      firstName,
      lastName,
      displayName,
      phoneNumber,
      dateOfBirth,
      nationality,
      gender
    } = req.body;

    const auth = new Auth();

    const hashedPassword = await PasswordUtils.hash(password);

    auth.email = email;
    auth.password = hashedPassword;
    auth.role = Role.OWNER;

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
    try {
      let user = await userRepository.findOneByAuthId(req.auth.id);

      if (!user) {
        res.status(404).send({
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
    } catch {
      res.status(500).send({
        error: "Internal server error"
      });
    }
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

  static me = async (req: Request, res: Response) => {
    try {
      const user = await userRepository.findOneByAuthId(req.auth.id);

      if (!user) {
        res.status(404).send({
          error: "User not found"
        });

        return;
      }

      res.send(user);
    } catch {
      res.status(500).send({
        error: "Internal server error"
      });
    }
  };

  static resetPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    try {
      const user = await userRepository.findOneWithAuth(id);

      if (!user) {
        res.status(404).send({
          error: "User not found"
        });

        return;
      }

      if (!newPassword) {
        res.status(400).send({
          error: "New password is required"
        });

        return;
      }

      // Hash the new password
      const hashedPassword = await PasswordUtils.hash(newPassword);

      // Update the auth record with the new password
      user.auth.password = hashedPassword;
      await authRepository.save(user.auth);

      /*
       * TODO: Send notification via notification-service
       * This is where you would integrate with the notification service
       * to send password reset confirmation email
       */

      res.send({
        message: "Password reset successful"
      });
    } catch {
      res.status(500).send({
        error: "Internal server error"
      });
    }
  };
}

export default UserController;
