import express, { Router } from "express";

import UserController from "src/controllers/User";

import { withValidation } from "src/middlewares/validation";

const router: Router = express.Router();

router.post("/user", withValidation, UserController.create);
router.patch("/user/:id", withValidation, UserController.update);
router.get("/user/:id", UserController.get);

export default router;