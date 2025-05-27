import express, { Router } from "express";

import PropertyController from "src/controllers/PropertyController";
import PropertyReviewController from "src/controllers/PropertyReviewController";
import { withValidation } from "./middlewares/validation";

const router: Router = express.Router();

router.post("/property", withValidation, PropertyController.create);
router.patch("/property/:id", PropertyController.update);
router.get("/property/:id", PropertyController.get);
router.delete("/property/:id", PropertyController.delete);
router.get("/properties/:ownerId/list", PropertyController.listForUser);

router.post("/property/review", withValidation, PropertyReviewController.create);
router.patch("/property/review/:id", PropertyReviewController.update);
router.get("/property/review/:id", PropertyReviewController.get);
router.delete("/property/review/:id", PropertyReviewController.delete);
router.get("/property/review/:propertyId/list", PropertyReviewController.listForProperty);

export default router;
