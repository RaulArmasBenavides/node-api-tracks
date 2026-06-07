# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Spotify Tracks API** is a RESTful API built with Express.js and TypeScript for managing Spotify tracks, user authentication, and categories. The project follows **Domain-Driven Design (DDD)** principles with a layered architecture.

## Development Commands

### Common Tasks

- **Start development server** (with hot reload): `npm run dev`
- **Build TypeScript to JavaScript**: `npm run build`
- **Run compiled code**: `npm start`
- **Format code**: `npm run prettier --write src/` (Prettier is installed)
- **Run tests**: `npm test`
- **Run tests in watch mode**: `npm run test:watch`
- **Generate coverage report**: `npm run test:coverage`

### Environment Setup

1. Copy `.env.example` to `.env` and fill in required values:
   - `MONGO_URL` - MongoDB connection string (e.g., `mongodb://localhost:27017`)
   - `MONGO_DB_NAME` - Database name (e.g., `spotify-tracks`)
   - `PORT` - Server port (default: 3000)
   - `JWT_SEED` - Secret for JWT token generation
   - `WEBSERVICE_URL` - Public URL of the API
   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB` - Redis connection details (defaults: localhost:6379:0)

2. **Quick start with Docker**:
   ```bash
   docker-compose up -d
   ```
   This starts both MongoDB and Redis. Verify they're running:
   ```bash
   docker-compose ps
   ```

3. **Manual setup** (without Docker):
   - MongoDB: Install and run locally, or use MongoDB Atlas cloud
   - Redis: Install and run locally on port 6379
   - Both must be running before starting the API

4. **Optional**: Configure email service variables (`SEND_EMAIL`, `MAILER_SERVICE`, etc.) for notification features

## Architecture Overview

The codebase is organized in layers following DDD principles:

### **Domain Layer** (`src/domain/entities/`)
Pure business logic, no dependencies on frameworks. Contains:
- `UserEntity` - User domain entity with role-based access (USER_ROLE, ADMIN_ROLE)
- `TrackEntity` - Music track entity
- `CategoryEntity` - Track category entity

Each entity has factory methods (`fromObject()`) for instantiation and serialization (`toObject()`).

### **Infrastructure Layer** (`src/infrastructure/`)
- **Database**: `src/infrastructure/data/database/mongo.ts` - MongoDB connection setup
- **Models**: Mongoose schemas mapped to TypeScript interfaces (`IUser`, `ITrack`, `ICategory`)
  - Located in `src/models/` (Mongoose schemas) and `src/infrastructure/data/models/` (TypeScript interfaces)

### **Presentation Layer** (`src/presentation/`)
Handles HTTP requests/responses:
- **Controllers** (`src/presentation/controllers/`) - Business logic handlers
  - `auth.ts` - Login, signup, Google OAuth
  - `tracks.ts` - CRUD operations for tracks
  - `history.ts` - User track history
- **Routes** (`src/presentation/routes/`) - Endpoint definitions
  - `auth.ts` - Authentication endpoints
  - `tracks.ts` - Tracks endpoints
  - `index.ts` - Route registration
- **Middleware** (`src/presentation/middleware/`)
  - `auth.ts` - JWT authentication verification
  - `roleAuth.ts` - Role-based authorization
  - `validar-campos.ts` - Input validation
  - `cache.ts` - Redis caching layer
  - `origin.ts` - CORS origin validation

### **Configuration Layer** (`src/configs/`)
- `envs.ts` - Environment variables validation (uses `env-var` library)
- `jwt.config.ts` - JWT settings
- `logger.config.ts` - Winston logger setup
- `brycript.adapt.ts` - Bcrypt password hashing adapter
- `uuid.adapter.ts` - UUID generation adapter

### **Helpers** (`src/helpers/`)
Utility functions:
- `generateToken.ts` - JWT token generation
- `google-verify.ts` - Google OAuth verification
- `handleBcrypt.ts` - Password encryption/comparison
- `handleError.ts` - HTTP error handling
- `validateHelper.ts` - Input validation utilities
- `menu-frontend.ts` - Menu data for frontend

## Key Implementation Details

### Authentication Flow
1. Users authenticate via email/password or Google OAuth
2. JWT tokens are generated upon successful login (see `generateToken.ts`)
3. Protected routes verified via Passport middleware with JWT strategy
4. Role-based access control enforced by `roleAuth.ts` middleware

### Database
- Uses MongoDB with Mongoose ODM
- Connection pooling and retry logic in `src/infrastructure/data/database/mongo.ts`
- Environment variable `MONGO_URL` for connection string

### API Documentation
- Swagger/OpenAPI docs auto-generated via `swagger-jsdoc`
- Available at `http://localhost:{PORT}/api/v1/docs`
- Configuration in `src/swagger.ts`

### Security Features
- Helmet.js for HTTP headers hardening
- CORS middleware for cross-origin requests
- Password hashing with bcryptjs
- JWT-based stateless authentication
- Input validation via express-validator

### Performance & Caching

**Redis Cache** (`src/presentation/middleware/cache.ts`):
- Uses `express-expeditious` with Redis engine (`expeditious-engine-redis`)
- Default TTL: 15 minutes (configurable)
- 404 responses cached for 5 minutes
- 500 errors not cached (TTL: 0)
- Namespace: `expresscache`
- Configuration:
  ```typescript
  const redisEngine = new RedisEngine({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    db: Number(process.env.REDIS_DB || 0),
  });
  ```

**Usage**:
```typescript
import { cacheInit } from './presentation/middleware/cache';
router.get('/endpoint', cacheInit, controller);
```

**Other performance features**:
- Compression middleware for response sizes
- Morgan HTTP request logging

## Code Style & Conventions

- **TypeScript**: Strict mode enabled (`tsconfig.json` has `strict: true`)
- **CommonJS**: Module system set to CommonJS for compatibility
- **Target**: ES2022
- **Code Formatting**: Prettier configured (format before commits)
- **File Structure**: Separate concerns by layer (domain → infrastructure → presentation)
- **Entity Patterns**: Use `fromObject()` to construct entities from data layer, `toObject()` for serialization

## Common Patterns

### Adding a New Feature

1. **Create entity** in `src/domain/entities/NewFeature.entity.ts` with `fromObject()` and `toObject()`
2. **Create Mongoose model** in `src/models/newfeature.model.ts` and TypeScript interface in `src/infrastructure/data/models/newfeature.interface.ts`
3. **Create controller** in `src/presentation/controllers/newfeature.ts`
4. **Create routes** in `src/presentation/routes/newfeature.ts`
5. **Register routes** in `src/presentation/routes/index.ts`
6. **Add middleware** as needed (auth, validation, caching)

### Accessing Environment Variables
Always use the centralized `envs` object from `src/configs/envs.ts` rather than reading `process.env` directly. This ensures validation at startup.

### Error Handling
Use the `httpError()` helper from `src/helpers/handleError.ts` for consistent error responses. Controllers should try-catch and call `httpError()` in the catch block.

## Testing

**Test Framework**: Jest with TypeScript support (`jest` + `ts-jest`)

**Run Tests**:
```bash
npm test              # Run all tests once
npm run test:watch   # Watch mode (re-run on file changes)
npm run test:coverage # Generate coverage report
```

**Test Structure**:
- Unit tests: `src/**/__tests__/**/*.test.ts`
- Tests are colocated with source files in `__tests__` folders
- Examples: `src/domain/entities/__tests__/user.entity.test.ts`

**Test Utilities**:
- **Unit Tests**: Test entities, helpers, adapters in isolation
  - Example: `user.entity.test.ts` - Tests UserEntity factory and serialization methods
  - Example: `handleBcrypt.test.ts` - Tests password encryption/comparison
- **Integration Tests**: Test controllers and routes with database/cache
  - Use Supertest for HTTP assertions: `import request from 'supertest'`
  - Mock Redis for cache tests to avoid external dependencies

**Best Practices**:
- Mock external dependencies (Redis, MongoDB) when possible
- Test both happy path and error cases
- Keep tests focused and isolated
- Use descriptive test names that explain the behavior
- Cleanup (cleanup mocks, close connections) in afterEach hooks

**Example Test**:
```typescript
import { UserEntity } from '../user.entity';

describe('UserEntity', () => {
  it('should create entity from object', () => {
    const user = UserEntity.fromObject({ id: '1', name: 'John', ... });
    expect(user.name).toBe('John');
  });
});
```

## Docker & Local Development

For local development with Docker:
- See **DOCKER.md** for full Docker Compose setup guide
- Quick start: `docker-compose up -d` then `npm run dev`
- MongoDB and Redis are automatically available

## Deployment Notes

- The project builds to `dist/` directory via TypeScript compilation
- Production: `npm run build && npm start`
- Ensure all environment variables are set before starting
- MongoDB and Redis connections must be available and reachable
- For production, use managed services (MongoDB Atlas, ElastiCache, etc.) instead of containerized instances
