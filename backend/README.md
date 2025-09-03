# ClearUp Backend

### Start backend services

To start all Docker containers:

```bash
cd backend
docker-compose up --build
```

### Stopping docker services

To stop all Docker containers:

```bash
docker-compose down
```

Look at Local Postgre Table via Docker

```bash
docker exec -it skincare-postgres psql -U postgres -d skincare
```
