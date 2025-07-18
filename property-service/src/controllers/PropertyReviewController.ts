import { Request, Response } from "express";
import PropertyReview from "src/model/PropertyReview";
import { propertyReviewRepository } from "src/repositories";

class PropertyReviewController {
  static create = async (req: Request, res: Response) => {
    const {
      propertyId,
      userId,
      rating,
      comment
    } = req.body;

    let review = new PropertyReview();

    review.propertyId = propertyId;
    review.userId = userId;
    review.rating = rating;
    review.comment = comment;

    try {
      review = await propertyReviewRepository.save(review);
      res.send(review);
    } catch {
      res.sendStatus(400);
    }
  };

  static update = async (req: Request, res: Response) => {
    let review = await propertyReviewRepository.findOneBy({ id: req.params.id });

    if (!review) {
      res.status(400).send({ error: "Review not found" });
      return;
    }

    review = {
      ...review,
      ...req.body,
      id: review.id
    } as PropertyReview;

    review = await propertyReviewRepository.save(review);

    res.send(review);
  };

  static get = async (req: Request, res: Response) => {
    const review = await propertyReviewRepository.findOneBy({ id: req.params.id });

    if (!review) {
      res.status(400).send({ error: "Review not found" });

      return;
    }

    res.send(review);
  };

  static delete = async (req: Request, res: Response) => {
    const review = await propertyReviewRepository.findOneBy({ id: req.params.id });

    if (!review) {
      res.status(400).send({ error: "Review not found" });

      return;
    }

    await propertyReviewRepository.remove(review);

    res.sendStatus(204);
  };

  static listForProperty = async (req: Request, res: Response) => {
    const reviews = await propertyReviewRepository.find({ propertyId: req.params.propertyId });

    res.send(reviews);
  };
}

export default PropertyReviewController;
