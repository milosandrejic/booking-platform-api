import { Request, Response } from "express";

import {
  Booking
} from "src/model";

import BookingStatus from "src/types/bookingStatus";

import { bookingRepository } from "src/repositories";

class BookingController {
  static create = async (req: Request, res: Response) => {
    const { propertyId, startDate, endDate, totalPrice } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).send({
        error: "User not authenticated"
      });

      return;
    }

    let booking = new Booking();

    booking.userId = userId;
    booking.propertyId = propertyId;
    booking.startDate = new Date(startDate);
    booking.endDate = new Date(endDate);
    booking.totalPrice = totalPrice;
    booking.status = BookingStatus.PENDING;

    try {
      booking = await bookingRepository.save(booking);

      res.status(201).send(booking);
    } catch {
      res.sendStatus(400);
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
