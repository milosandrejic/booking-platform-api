import PropertyPricingController from "src/controllers/PropertyPricingController";
import PropertyPrice from "src/model/PropertyPrice";
import SeasonalPrice from "src/model/SeasonalPrice";

describe("PropertyPricingController", () => {
  describe("calculateTotalPrice", () => {
    const mockPricing = {
      basePricePerNight: 100,
      weekendPrice: 150,
      cleaningFee: 25,
      serviceFeePercent: 10,
      currency: "EUR"
    } as PropertyPrice;

    it("should calculate price with base pricing only", () => {
      const startDate = new Date("2024-01-01"); // Monday
      const endDate = new Date("2024-01-05"); // Friday
      const seasonalPrices: SeasonalPrice[] = [];

      const result = PropertyPricingController.calculateTotalPrice(
        startDate,
        endDate,
        mockPricing,
        seasonalPrices
      );

      expect(result.subtotal).toBe(400); // 4 days * 100
      expect(result.cleaningFee).toBe(25);
      expect(result.serviceFee).toBe(40); // 10% of 400
      expect(result.total).toBe(465);
      expect(result.days).toHaveLength(4);
    });

    it("should calculate price with weekend pricing", () => {
      const startDate = new Date("2024-01-05"); // Friday
      const endDate = new Date("2024-01-08"); // Monday
      const seasonalPrices: SeasonalPrice[] = [];

      const result = PropertyPricingController.calculateTotalPrice(
        startDate,
        endDate,
        mockPricing,
        seasonalPrices
      );

      // Friday: base (100), Saturday: weekend (150), Sunday: weekend (150)
      expect(result.subtotal).toBe(400); // 100 + 150 + 150
      expect(result.total).toBe(465); // 400 + 25 + 40
    });

    it("should calculate price with seasonal pricing override", () => {
      const startDate = new Date("2024-12-22");
      const endDate = new Date("2024-12-27");
      const seasonalPrices: SeasonalPrice[] = [
        {
          startDate: new Date("2024-12-20"),
          endDate: new Date("2024-12-30"),
          pricePerNight: 200
        } as SeasonalPrice
      ];

      const result = PropertyPricingController.calculateTotalPrice(
        startDate,
        endDate,
        mockPricing,
        seasonalPrices
      );

      expect(result.subtotal).toBe(1000); // 5 days * 200
      expect(result.cleaningFee).toBe(25);
      expect(result.serviceFee).toBe(100); // 10% of 1000
      expect(result.total).toBe(1125);
    });
  });
});
