# Booking Service

## Overview

The Booking Service manages property bookings for the booking platform. It handles booking creation, retrieval, and cancellation with proper authorization.

## Features

- **Create Bookings**: Users can create new bookings for properties
- **View Bookings**: Users can view their own bookings; property owners can view bookings for their properties
- **Booking Details**: Get detailed information about specific bookings
- **Cancel Bookings**: Users and property owners can cancel bookings

## API Endpoints

| Method   | Route                  | Description                            |
|----------|------------------------|----------------------------------------|
| POST     | `/api/v1/bookings`     | Create a new booking                   |
| GET      | `/api/v1/bookings`     | Get all bookings (by user or property) |
| GET      | `/api/v1/bookings/:id` | Get booking details                    |
| DELETE   | `/api/v1/bookings/:id` | Cancel a booking                       |

## Authentication & Authorization

All routes require JWT authentication. Users can only:
- Create bookings for themselves
- View their own bookings
- Cancel their own bookings

Property owners can additionally:
- View bookings for their properties
- Cancel bookings for their properties

## Booking Model

```typescript
{
  id: string;          // UUID
  userId: string;      // User who made the booking
  propertyId: string;  // Property being booked
  startDate: Date;     // Check-in date
  endDate: Date;       // Check-out date
  totalPrice: number;  // Total booking cost
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

```env
PORT=9003
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=booking_service
JWT_SECRET=your_jwt_secret_key
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## API Documentation

Swagger UI documentation is available at `/api-docs` when the service is running.

## Docker

The service includes Docker configuration and is included in the main docker-compose.yml file.
