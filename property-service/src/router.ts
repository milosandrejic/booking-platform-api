import express, { Router } from "express";

import PropertyController from "src/controllers/PropertyController";
import PropertyReviewController from "src/controllers/PropertyReviewController";
import PropertyPricingController from "src/controllers/PropertyPricingController";
import { withValidation } from "src/middlewares/validation";
import { withAuth } from "src/middlewares/auth";
import { withInternalAuth } from "src/middlewares/internalAuth";

const router: Router = express.Router();
const internalRouter: Router = express.Router();

// Public routes
router.post("/property", withAuth, withValidation, PropertyController.create);
router.patch("/property/:id", withAuth, PropertyController.update);
router.get("/property/:id", withAuth, PropertyController.get);
router.delete("/property/:id", withAuth, PropertyController.delete);
router.get("/properties/:ownerId/list", withAuth, PropertyController.listForUser);

// Pricing routes
router.post("/properties/:propertyId/pricing", withAuth, withValidation, PropertyPricingController.setPricing);
router.get("/properties/:propertyId/pricing", withAuth, PropertyPricingController.getPricing);

// Seasonal pricing routes
router.post("/properties/:propertyId/seasonal-pricing", withAuth, withValidation, PropertyPricingController.addSeasonalPricing);
router.get("/properties/:propertyId/seasonal-pricing", withAuth, PropertyPricingController.getSeasonalPricing);

// Internal-only routes (service-to-service communication)
internalRouter.post("/property/:id/pricing/calculate", withInternalAuth, PropertyPricingController.calculatePrice);
internalRouter.get("/property/:id", withInternalAuth, PropertyController.get);

// Review routes
router.post("/property/review", withAuth, withValidation, PropertyReviewController.create);
router.patch("/property/review/:id", withAuth, PropertyReviewController.update);
router.get("/property/review/:id", withAuth, PropertyReviewController.get);
router.delete("/property/review/:id", withAuth, PropertyReviewController.delete);
router.get("/property/review/:propertyId/list", withAuth, PropertyReviewController.listForProperty);

export default router;
export { internalRouter };
