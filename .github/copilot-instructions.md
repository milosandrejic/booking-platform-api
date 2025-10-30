# Copilot Instructions - Booking Platform API

## Architecture Overview

This is a **microservices-based booking platform** with three core services behind an Nginx API gateway:
- **User Service** (port 9001): Authentication, user/owner management, JWT token generation
- **Property Service** (port 9002): Property listings with PostGIS geospatial support
- **Booking Service** (port 9003): Booking creation/management with service-to-service API calls
- **Nginx Gateway** (port 9000): Routes `/api/v1/{user,property,booking}/` to respective services

Each service has its own PostgreSQL database with separate schemas. Services communicate via HTTP using internal service tokens.

## Tech Stack & Conventions

- **TypeScript** with path aliases (`src/*` maps to `./src/*`)
- **TypeORM** entities with decorators, migrations disabled in production (`synchronize: false`)
- **Express** with middleware chaining pattern: `router.post("/path", withAuth, withValidation, Controller.method)`
- **Express-validator** schemas in `validations/schema.ts`, applied via `ValidationFactory` middleware
- **Jest** for testing with `ts-jest` preset
- **Docker Compose** for local dev with hot-reload via nodemon and volume mounts

## Critical Patterns

### 1. Service-to-Service Authentication
**All services use the same standardized internal auth system with strict separation.**

**Architecture:**
- Internal routes at `/api/internal/*` - ONLY accept internal service tokens
- Public routes at `/api/v1/*` - Accept user JWT tokens
- Nginx blocks external access to `/api/internal/*` paths (returns 403)

**Client-side (calling service)** - Generate and cache tokens:
```typescript
// booking-service/src/utils/internalAuth.ts
headers: {
  "x-internal-service-token": getCachedInternalServiceToken()
}
```

**Server-side (receiving service)** - Validate via `withInternalAuth` middleware:
```typescript
// {user,property}-service/src/middlewares/internalAuth.ts
export const withInternalAuth = (req: Request, res: Response, next: NextFunction)
// ONLY accepts x-internal-service-token header (no fallback to user JWT)
// Validates token against INTERNAL_SERVICE_SECRET
// Checks serviceId/serviceName against ALLOWED_SERVICES whitelist
// Returns 401 if no token, 403 if service not whitelisted
```

**Router pattern:**
```typescript
// Separate routers for public vs internal
export const router: Router = express.Router();
export const internalRouter: Router = express.Router();

// Public routes (user JWT)
router.get("/user/:id", withAuth, UserController.get);

// Internal routes (service token only)
internalRouter.get("/user/:id", withInternalAuth, UserController.get);

// Mount in server.ts
app.use("/api/v1", router);
app.use("/api/internal", internalRouter);
```

Internal tokens auto-refresh with 2min buffer before expiry (15min TTL). Each service maintains a whitelist of allowed calling services.

### 2. Repository Pattern
All data access goes through TypeORM-based repositories:
- Located in `repositories/` folder
- Expose domain-specific methods (e.g., `findByUserId`, `cancelBooking`)
- Example: `booking-service/src/repositories/BookingRepository.ts`

**Never use `dataSource.getRepository()` directly in controllers.**

### 3. Validation Architecture
Routes use a factory pattern for validation schemas:
```typescript
// ValidationFactory maps "METHOD:/path" to validation chains
ValidationFactory.getValidationSchema("/bookings", "POST")
```

Validation errors return structured 400 responses with field-level errors via `validationResult.mapped()`.

### 4. Database Setup
- Each service has `initial.sql` with user creation and extensions (`uuid-ossp`, `citext`)
- **Property Service** additionally uses PostGIS extension for geometry columns
- Migrations managed via TypeORM CLI: `npm run migration:generate --filename=<name>`

## Development Workflows

### Running the Stack
```bash
# Start all services with hot-reload
docker-compose up

# Access services:
# - Gateway: http://localhost:9000/api/v1/{user,property,booking}/
# - Swagger docs: http://localhost:900{1,2,3}/docs
```

### Working on a Single Service
```bash
cd user-service  # or property-service, booking-service

# Install deps (if package.json changed)
npm install

# Run tests
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage

# Lint
npm run lint

# Build
npm run build  # Output to ./build via tsc + tsc-alias
```

### Database Migrations
```bash
# Generate migration from entity changes
npm run migration:generate --filename=add-user-fields

# Run pending migrations
npm run migration:up

# Rollback last migration
npm run migration:down
```

**Note**: Migrations use `ts-node` with `tsconfig-paths/register` for path alias support.

### Environment Files
- `.env` - Local development (direct DB access on ports 9432-9434)
- `.env-dev` - Docker development (services connect to containers on port 5432)

Docker Compose mounts `.env-dev` as `.env` inside containers.

## Key Architectural Decisions

### Why Separate Databases?
Each service owns its data store following microservices patterns. Cross-service data access happens via API calls (e.g., Booking Service calls Property Service to calculate pricing).

### Why Internal Service Tokens?
Prevents unauthorized inter-service communication while avoiding the need to validate user JWTs across services. Services can verify requests originate from trusted internal services.

### Why PostGIS Only in Property Service?
Geospatial queries (location-based search) are property-specific features. Other services reference properties by UUID without needing geo capabilities.

### Why Validation Factory?
Centralizes route-to-schema mapping, avoiding scattered validation logic across controller files. Makes it easy to see all validation rules in `validations/schema.ts`.

## Common Gotchas

1. **Path Alias Issues**: If imports fail, ensure `tsconfig-paths/register` is in nodemon/ts-node commands
2. **Migration Errors**: Always use the npm scripts (not raw TypeORM CLI) to ensure path resolution works
3. **Port Conflicts**: Services expect specific ports (9001-9003). Check nothing else is bound to these.
4. **PostgreSQL Extensions**: Property DB requires PostGIS image (`postgis/postgis`), others use standard Postgres
5. **Internal Service Auth**: `INTERNAL_SERVICE_SECRET` must be identical across all services. Update `ALLOWED_SERVICES` whitelist in `middlewares/internalAuth.ts` when adding new services.
6. **Validation Factory Keys**: Route patterns must match exactly (e.g., `/bookings/:id` not `/bookings/{id}`)
7. **JWT Secrets**: Each service needs its own unique `JWT_SECRET` for user authentication (not shared)
8. **Internal Routes**: Service-to-service calls must use `/api/internal/*` routes, not `/api/v1/*`. External access to `/api/internal/*` is blocked by Nginx.
9. **Required Env Vars**: Services will fail to start if `INTERNAL_SERVICE_SECRET` is not set (no fallback)

## File Locations

- Controllers: `src/controllers/` - Handle HTTP logic
- Repositories: `src/repositories/` - Database access layer
- Models: `src/model/` - TypeORM entities
- Middlewares: `src/middlewares/` - Auth, validation, error handling
- Validations: `src/validations/schema.ts` - Express-validator rules
- Types: `src/types/` - Enums and type definitions
- API Clients: `src/api/` - Service-to-service communication (Booking Service only)
- Utils: `src/utils/` - JWT helpers, password hashing, internal auth

## Testing Approach

Tests live in `src/tests/` and use Jest with Supertest for HTTP assertions. Example pattern from `booking-service/src/tests/internalAuth.test.ts`:
- Mock external service calls
- Test middleware behavior in isolation
- Verify token generation/validation logic

**Coverage Target: 90%+**. Always run `npm run test:coverage` before committing to ensure coverage thresholds are met. Coverage reports output to `coverage/` folder with HTML reports in `coverage/lcov-report/`.

## Required Environment Variables

Each service requires these environment variables (see `.env` files):

**Common to all services**:
- `PORT` - Service port (9001/9002/9003)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (5432 in Docker, 9432-9434 locally)
- `DB_USER` - Database user (default: `booking`)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (`booking-users`, `booking-properties`, `booking-bookings`)
- `JWT_SECRET` - Service-specific secret for user JWT validation (unique per service)
- `INTERNAL_SERVICE_SECRET` - Shared secret for inter-service authentication (same across all services)

**Service-specific**:
- `SERVICE_ID` - Identifier for internal auth (e.g., `booking-service`)
- `SERVICE_NAME` - Display name for internal auth (e.g., `Booking Service`)
- `PROPERTY_SERVICE_URL` / `USER_SERVICE_URL` - URLs for service-to-service calls (Booking Service only)
