import express, { Router } from "express";

import AuthController from "src/controllers/Auth";
import UserController from "src/controllers/User";

import { withValidation } from "src/middlewares/validation";
import { withAuth } from "src/middlewares/auth";
import { withInternalAuth } from "src/middlewares/internalAuth";

export const router: Router = express.Router();
export const internalRouter: Router = express.Router();

// Public routes
router.post("/login", withValidation, AuthController.login);
router.post("/customer", withValidation, UserController.createCustomer);
router.post("/owner", withValidation, UserController.createOwner);
router.patch("/me", withAuth, withValidation, UserController.update);
router.get("/user/:id", withAuth, UserController.get);
router.get("/me", withAuth, UserController.me);
router.post("/user/:id/reset-password", withAuth, withValidation, UserController.resetPassword);

// Internal-only routes (service-to-service communication)
internalRouter.get("/user/:id", withInternalAuth, UserController.get);
