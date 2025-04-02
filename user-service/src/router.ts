import express, { Router } from "express";

import AuthController from "controllers/AuthController";

const router: Router = express.Router();

router.get("/auth/:id", AuthController.get);

export default router;