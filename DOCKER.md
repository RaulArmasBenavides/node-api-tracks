# Docker Setup Guide

This project uses Docker Compose to easily set up MongoDB and Redis for local development.

## Prerequisites

- Docker Desktop installed and running (https://www.docker.com/products/docker-desktop)
- Git and Node.js for the application itself

## Quick Start

### 1. Start Services

```bash
docker-compose up -d
```

This starts:
- **MongoDB** on `localhost:27017` (database: spotify-tracks)
- **Redis** on `localhost:6379`

### 2. Verify Services are Running

```bash
docker-compose ps
```

Expected output:
```
NAME                      COMMAND                  SERVICE      STATUS      PORTS
spotify-api-mongodb       "mongosh localhost..."   mongodb      Up (healthy)   27017/tcp
spotify-api-redis         "redis-server --app..."  redis        Up (healthy)   6379/tcp
```

### 3. Install and Run Application

```bash
npm install
npm run dev
```

API will be available at `http://localhost:3000/api/v1`
Swagger docs at `http://localhost:3000/api/v1/docs`

## Useful Commands

### Stop Services
```bash
docker-compose stop
```

### Start Services (after stopping)
```bash
docker-compose start
```

### Restart Services
```bash
docker-compose restart
```

### Clean Up Everything (remove containers and volumes)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Connect to MongoDB

```bash
# Using mongosh inside the container
docker exec -it spotify-api-mongodb mongosh

# Inside mongosh, you can:
show databases
use spotify-tracks
db.users.find()
```

### Connect to Redis

```bash
# Using redis-cli inside the container
docker exec -it spotify-api-redis redis-cli

# Inside redis-cli, you can:
PING
KEYS *
GET expresscache:*
```

## MongoDB Connection Details

- **Host**: localhost (or mongo in docker network)
- **Port**: 27017
- **Database**: spotify-tracks
- **Connection String**: `mongodb://localhost:27017`

Environment variable in `.env`:
```
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=spotify-tracks
```

## Redis Connection Details

- **Host**: localhost (or redis in docker network)
- **Port**: 6379
- **DB**: 0
- **Connection String**: `redis://localhost:6379`

Environment variables in `.env`:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Port Already in Use

If port 27017 (MongoDB) or 6379 (Redis) is already in use:

```bash
# Find what's using the port
lsof -i :27017
lsof -i :6379

# Or modify docker-compose.yml to use different ports
# Example: "27018:27017" for MongoDB
```

### Container Won't Start

```bash
# Check logs
docker-compose logs mongodb
docker-compose logs redis

# Force rebuild
docker-compose down
docker-compose up -d --force-recreate
```

### Cannot Connect to Services

Ensure services are healthy:
```bash
docker-compose ps
```

Wait for health checks to pass (status should show "Up (healthy)" not just "Up")

### Reset Everything

```bash
# Remove containers, networks, and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Data Persistence

- **MongoDB**: Data stored in `mongodb_data` volume
- **Redis**: Data stored in `redis_data` volume

Volumes persist between container restarts. Use `docker-compose down -v` to delete them.

## Development Workflow

1. **Start containers**: `docker-compose up -d`
2. **Install dependencies**: `npm install`
3. **Run in dev mode**: `npm run dev`
4. **Make code changes** - app will auto-reload
5. **Run tests**: `npm test`
6. **Stop containers**: `docker-compose down`

## Production Deployment

This `docker-compose.yml` is for **development only**. For production:
- Use managed MongoDB (Atlas, DocumentDB, etc.)
- Use managed Redis (ElastiCache, etc.)
- Set environment variables from secure vaults
- Use proper authentication credentials
- Enable monitoring and backups
