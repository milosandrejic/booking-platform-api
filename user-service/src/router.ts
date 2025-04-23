import express, { Router } from "express";

import UserController from "src/controllers/User";

const router: Router = express.Router();

router.post("/", UserController.create);
router.patch("/:id", UserController.update);

export default router;