import { Request, Response } from "express";

import {
  Booking
} from "src/model";

import BookingStatus from "src/types/bookingStatus";

import { bookingRepository } from "src/repositories";
import { propertyServiceAPI } from "src/api";

class BookingController {
  static create = async (req: Request, res: Response) => {
    const { propertyId, startDate, endDate } = req.body;
    const userId = req.user?.id;
    const authToken = req.headers.authorization?.replace("Bearer ", "");

    if (!userId) {
      res.status(401).send({
        error: "User not authenticated"
      });

      return;
    }

    if (!authToken) {
      res.status(401).send({
        error: "Authorization token required"
      });

      return;
    }

    try {
      // Calculate price using the property service
      const priceCalculation = await propertyServiceAPI.calculatePrice(
        propertyId,
        startDate,
        endDate
      );

      let booking = new Booking();

      booking.userId = userId;
      booking.propertyId = propertyId;
      booking.startDate = new Date(startDate);
      booking.endDate = new Date(endDate);
      booking.totalPrice = priceCalculation.totalPrice;
      booking.status = BookingStatus.PENDING;

      booking = await bookingRepository.save(booking);

      res.status(201).send({
        ...booking,
        priceBreakdown: priceCalculation.breakdown
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Property service error")) {
        res.status(400).send({
          error: "Unable to calculate price for this property"
        });
      } else {
        res.status(500).send({
          error: "Internal server error"
        });
      }
    }
  };

  static getAll = async (req: Request, res: Response) => {
    const { userId, propertyId } = req.query;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).send({
        error: "User not authenticated"
      });

      return;
    }

    try {
      let bookings;

      if (userId) {
        if (userId !== currentUserId && req.user?.role !== "owner") {
          res.status(403).send({
            error: "Access denied"
          });

          return;
        }
        bookings = await bookingRepository.findByUserId(userId as string);
      } else if (propertyId) {
        bookings = await bookingRepository.findByPropertyId(propertyId as string);
      } else {
        bookings = await bookingRepository.findByUserId(currentUserId);
      }

      res.send(bookings);
    } catch {
      res.status(500).send({
        error: "Internal server error"
      });
    }
  };

  static get = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).send({
        error: "User not authenticated"
      });

      return;
    }

    const booking = await bookingRepository.findOneBy({ id });

    if (!booking) {
      res.status(404).send({
        error: "Booking not found"
      });

      return;
    }

    if (booking.userId !== currentUserId && req.user?.role !== "owner") {
      res.status(403).send({
        error: "Access denied"
      });

      return;
    }

    res.send(booking);
  };

  static cancel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId || !id) {
      res.status(401).send({
        error: "User not authenticated"
      });

      return;
    }

    const booking = await bookingRepository.findOneBy({ id });

    if (!booking) {
      res.status(404).send({
        error: "Booking not found"
      });

      return;
    }

    if (booking.userId !== currentUserId && req.user?.role !== "owner") {
      res.status(403).send({
        error: "Access denied"
      });

      return;
    }

    try {
      const cancelledBooking = await bookingRepository.cancelBooking(id);

      res.send(cancelledBooking);
    } catch {
      res.status(500).send({
        error: "Internal server error"
      });
    }
  };
}

export default BookingController;
