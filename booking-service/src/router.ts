import express, { Router } from "express";
import BookingController from "src/controllers/BookingController";
import { withAuth } from "src/middlewares/auth";
import { withValidation } from "src/middlewares/validation";

const router: Router = express.Router();

router.post("/bookings", withAuth, withValidation, BookingController.create);
router.get("/bookings", withAuth, withValidation, BookingController.getAll);
router.get("/bookings/:id", withAuth, withValidation, BookingController.get);
router.delete("/bookings/:id", withAuth, BookingController.cancel);

export default router;
