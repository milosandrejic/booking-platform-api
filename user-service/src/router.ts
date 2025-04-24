import express, { Router } from "express";

import UserController from "src/controllers/User";

import { withValidation } from "src/middlewares/validation";
import { ValidationFactory } from "src/validations/validationFatory";

const router: Router = express.Router();

router.post("/user", ValidationFactory.getValidationSchema("/user"), withValidation, UserController.create);
router.patch("/user/:id", UserController.update);
router.get("/user/:id", UserController.get);

export default router;