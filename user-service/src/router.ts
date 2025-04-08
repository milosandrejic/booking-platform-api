import express, { Router } from "express";

import ProfileController from "src/controllers/Profile";

const router: Router = express.Router();

router.post("/profile", ProfileController.create);

export default router;