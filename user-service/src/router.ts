import express, { Router } from "express";

import ProfileController from "src/controllers/Profile";

const router: Router = express.Router();

router.post("/profile", ProfileController.create);
router.patch("/profile/:id", ProfileController.update);

export default router;