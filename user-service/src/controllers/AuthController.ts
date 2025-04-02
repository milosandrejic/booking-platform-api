import {Request, Response} from "express"

class AuthController {
  get = async (req: Request, res: Response) => {
    const {id} = req.params;

    res.send(`Requested resource with id:${id}`)
  }
}

export default new AuthController();
