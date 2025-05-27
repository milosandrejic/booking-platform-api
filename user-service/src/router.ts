import express, { Router } from "express";

import AuthController from "src/controllers/Auth";
import UserController from "src/controllers/User";

import { withValidation } from "src/middlewares/validation";
import { withAuth } from "src/middlewares/auth";

export const router: Router = express.Router();
export const internalRouter: Router = express.Router();

router.post("/login", AuthController.login);
router.post("/user", withValidation, UserController.create);
router.patch("/user/:id", withAuth, withValidation, UserController.update);
router.get("/user/:id", withAuth, UserController.get);
