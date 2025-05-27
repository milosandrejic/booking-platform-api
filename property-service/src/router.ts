import express, { Router } from "express";

import PropertyController from "src/controllers/PropertyController";
import PropertyReviewController from "src/controllers/PropertyReviewController";
import { withValidation } from "./middlewares/validation";
import { withAuth } from "./middlewares/auth";

const router: Router = express.Router();

router.post("/property", withAuth, withValidation, PropertyController.create);
router.patch("/property/:id", withAuth, PropertyController.update);
router.get("/property/:id", withAuth, PropertyController.get);
router.delete("/property/:id", withAuth, PropertyController.delete);
router.get("/properties/:ownerId/list", withAuth, PropertyController.listForUser);

router.post("/property/review", withAuth, withValidation, PropertyReviewController.create);
router.patch("/property/review/:id", withAuth, PropertyReviewController.update);
router.get("/property/review/:id", withAuth, PropertyReviewController.get);
router.delete("/property/review/:id", withAuth, PropertyReviewController.delete);
router.get("/property/review/:propertyId/list", withAuth, PropertyReviewController.listForProperty);

export default router;
