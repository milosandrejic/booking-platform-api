import { Request, Response } from "express";
import { propertyRepository, propertyPriceRepository, seasonalPriceRepository } from "src/repositories";
import PropertyPrice from "src/model/PropertyPrice";
import SeasonalPrice from "src/model/SeasonalPrice";

class PropertyPricingController {
  static setPricing = async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const {
      basePricePerNight,
      weekendPrice,
      cleaningFee,
      serviceFeePercent,
      currency
    } = req.body;

    try {
      const property = await propertyRepository.findOneBy({ id: propertyId });
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }

      let pricing = await propertyPriceRepository.findOneBy({ propertyId });

      if (pricing) {
        pricing.basePricePerNight = basePricePerNight;
        pricing.weekendPrice = weekendPrice;
        pricing.cleaningFee = cleaningFee || 0;
        pricing.serviceFeePercent = serviceFeePercent || 0;
        pricing.currency = currency || "EUR";
      } else {
        pricing = new PropertyPrice();
        pricing.propertyId = propertyId;
        pricing.basePricePerNight = basePricePerNight;
        pricing.weekendPrice = weekendPrice;
        pricing.cleaningFee = cleaningFee || 0;
        pricing.serviceFeePercent = serviceFeePercent || 0;
        pricing.currency = currency || "EUR";
      }

      const savedPricing = await propertyPriceRepository.save(pricing);
      res.status(201).json(savedPricing);
    } catch {
      res.status(400).json({ error: "Failed to set pricing" });
    }
  };

  static getPricing = async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    try {
      const pricing = await propertyPriceRepository.findOneBy({ propertyId });

      if (!pricing) {
        res.status(404).json({ error: "Pricing not found for this property" });
        return;
      }

      res.json(pricing);
    } catch {
      res.status(400).json({ error: "Failed to get pricing" });
    }
  };

  static addSeasonalPricing = async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const { startDate, endDate, pricePerNight } = req.body;

    try {
      const property = await propertyRepository.findOneBy({ id: propertyId });
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }

      const overlapping = await seasonalPriceRepository
        .createQueryBuilder("sp")
        .where("sp.propertyId = :propertyId", { propertyId })
        .andWhere(
          "(sp.startDate <= :endDate AND sp.endDate >= :startDate)",
          {
            startDate,
            endDate
          }
        )
        .getOne();

      if (overlapping) {
        res.status(400).json({
          error: "Seasonal pricing period overlaps with existing period"
        });
        return;
      }

      const seasonalPrice = new SeasonalPrice();
      seasonalPrice.propertyId = propertyId;
      seasonalPrice.startDate = new Date(startDate);
      seasonalPrice.endDate = new Date(endDate);
      seasonalPrice.pricePerNight = pricePerNight;

      const savedSeasonalPrice = await seasonalPriceRepository.save(seasonalPrice);
      res.status(201).json(savedSeasonalPrice);
    } catch {
      res.status(400).json({ error: "Failed to add seasonal pricing" });
    }
  };

  static getSeasonalPricing = async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    try {
      const seasonalPrices = await seasonalPriceRepository.find({
        where: { propertyId },
        order: { startDate: "ASC" }
      });

      res.json(seasonalPrices);
    } catch {
      res.status(400).json({ error: "Failed to get seasonal pricing" });
    }
  };

  static calculatePrice = async (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "startDate and endDate are required" });
      return;
    }

    try {
      const pricing = await propertyPriceRepository.findOneBy({ propertyId });
      if (!pricing) {
        res.status(404).json({ error: "Pricing not found for this property" });
        return;
      }

      const seasonalPrices = await seasonalPriceRepository.find({
        where: { propertyId },
        order: { startDate: "ASC" }
      });

      const calculation = PropertyPricingController.calculateTotalPrice(
        new Date(startDate as string),
        new Date(endDate as string),
        pricing,
        seasonalPrices
      );

      res.json(calculation);
    } catch {
      res.status(400).json({ error: "Failed to calculate price" });
    }
  };

  static calculateTotalPrice = (
    startDate: Date,
    endDate: Date,
    pricing: PropertyPrice,
    seasonalPrices: SeasonalPrice[]
  ) => {
    const days = [];
    let subtotal = 0;

    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = currentDate.toISOString().split("T")[0];

      const seasonalPrice = seasonalPrices.find(sp => currentDate >= sp.startDate && currentDate <= sp.endDate);

      let dailyPrice;
      let source;

      if (seasonalPrice) {
        dailyPrice = Number(seasonalPrice.pricePerNight);
        source = "Seasonal Price";
      } else if (isWeekend && pricing.weekendPrice) {
        dailyPrice = Number(pricing.weekendPrice);
        source = "Weekend Price";
      } else {
        dailyPrice = Number(pricing.basePricePerNight);
        source = "Base Price";
      }

      days.push({
        date: dateStr,
        source,
        price: dailyPrice
      });

      subtotal += dailyPrice;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const cleaningFee = Number(pricing.cleaningFee);
    const serviceFeePercent = Number(pricing.serviceFeePercent);
    const serviceFee = subtotal * serviceFeePercent / 100;
    const total = subtotal + cleaningFee + serviceFee;

    return {
      days,
      subtotal,
      cleaningFee,
      serviceFee,
      serviceFeePercent,
      total,
      currency: pricing.currency
    };
  };
}

export default PropertyPricingController;
