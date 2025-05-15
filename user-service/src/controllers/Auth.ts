import {Request, Response} from "express";
import jwt from "jsonwebtoken";

import {authRepository} from "src/repositories";
import {PasswordUtils} from "src/utils/passwordUtils";

class AuthController {

  login = async (req: Request, res: Response) => {

    const {
      email,
      password
    } = req.body;

    const auth = await authRepository.findOneBy({email});

    if (!auth) {

      res.status(400).send({
        "error": `User with email ${email} does no exists`
      });

      return;

    }

    const passwordsMatch = await PasswordUtils.compare(
      password,
      auth.password
    );

    if (!passwordsMatch) {

      res.status(400).send({
        "error": "Wrong email or password"
      });

      return;

    }

    const access_token = jwt.sign(
      {
        "id": auth.id,
        "email": auth.email,
        "role": auth.role
      },
      process.env.JWT_SECRET as string
    );

    auth.access_token = access_token;

    authRepository.save(auth);

    res.send({access_token});

  };

}

export default new AuthController();
