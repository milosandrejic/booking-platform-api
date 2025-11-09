import express, { Router } from "express";
import LocationController from "src/controllers/LocationController";

const router: Router = express.Router();

// Location routes (public - no auth required)
router.get("/location/autocomplete", LocationController.autocomplete);
router.get("/location/place/:placeId", LocationController.placeDetails);

export default router;
