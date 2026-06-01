# Blue-Green Deployment Guide

This document explains the blue-green deployment strategy and how to use it.

## Overview

Blue-green deployment is a release technique that reduces downtime and risk by running two identical production environments called Blue and Green.

- **Blue**: Current active environment serving production traffic
- **Green**: New environment with updated code, ready to be activated

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Load Balancers                    │
├──────────────────────┬───────────────────────────────┤
│   Backend LB         │      Frontend LB              │
│   (Port 8080)        │      (Port 3000)              │
├──────────────────────┼───────────────────────────────┤
│   Backend Blue       │      Frontend Blue            │
│   (Port 8080)        │      (Port 3000)              │
│                      │                               │
│   Backend Green      │      Frontend Green           │
│   (Port 8081)        │      (Port 3000)              │
└──────────────────────┴───────────────────────────────┘
```

## Deployment Process

### 1. Start Both Environments

```bash
docker-compose up --build
```

This starts:
- Backend Blue (port 8080)
- Backend Green (port 8081)
- Frontend Blue (port 3000)
- Frontend Green (port 3000)
- Nginx load balancers

### 2. Check Deployment Status

```bash
./scripts/deployment-status.sh
```

Output shows health status of all deployments:
```
==========================================
Deployment Status
==========================================

Backend Status:
  Blue (port 8080):
    ✓ Healthy
  Green (port 8081):
    ✓ Healthy

Frontend Status:
  Blue:
    ✓ Healthy
  Green:
    ✓ Healthy

Load Balancer:
  Backend LB (port 8080): http://localhost:8080
  Frontend LB (port 3000): http://localhost:3000

==========================================
```

### 3. Deploy New Version

Update your code and rebuild:

```bash
docker-compose up --build
```

The new version is deployed to the inactive environment (green if blue is active).

### 4. Test New Version

Access the new version directly:
- Backend: `http://localhost:8081` (if green is inactive)
- Frontend: `http://localhost:3000` (through load balancer)

Run your test suite to verify the new version works correctly.

### 5. Switch Traffic

Once verified, switch traffic to the new version:

```bash
./scripts/switch-deployment.sh green
```

This switches the load balancer to route traffic to the green deployment.

### 6. Rollback (if needed)

If issues are detected, instantly rollback to the previous version:

```bash
./scripts/switch-deployment.sh blue
```

## Benefits

### Zero Downtime
- No service interruption during deployment
- Users continue accessing the application seamlessly

### Easy Rollback
- Revert to previous version instantly with one command
- No need to rebuild or restart services

### Testing
- Test new version before switching traffic
- Verify all functionality works correctly

### Health Checks
- Automatic failover if deployment becomes unhealthy
- Load balancer only routes to healthy instances

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Build & Test**: Compiles backend and frontend on every commit
2. **Build Images**: Creates Docker images for both services
3. **Push to Registry**: Pushes images to container registry
4. **Deployment Summary**: Provides status in GitHub Actions

### Workflow Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` branch

### Deployment Summary
After successful build, check GitHub Actions for:
- Deployment status
- Active/standby deployments
- Next steps for switching

## Monitoring

### Check Service Health

```bash
# Backend health
curl http://localhost:8080/health

# Frontend health
curl http://localhost:3000
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend-blue
docker-compose logs -f frontend-green
```

## Troubleshooting

### Port Already in Use

If ports 8080 or 3000 are already in use:

```bash
# Find process using port
lsof -i :8080
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Deployment Not Healthy

Check logs:
```bash
docker-compose logs backend-blue
docker-compose logs backend-green
```

Rebuild and restart:
```bash
docker-compose down
docker-compose up --build
```

### Load Balancer Issues

Verify Nginx configuration:
```bash
docker-compose logs backend-lb
docker-compose logs frontend-lb
```

## Best Practices

1. **Always test before switching**: Verify new version works correctly
2. **Monitor after switching**: Watch logs and metrics for issues
3. **Keep both versions running**: Maintain standby for quick rollback
4. **Automate with CI/CD**: Use GitHub Actions for consistent deployments
5. **Document changes**: Keep deployment notes for reference

## Configuration

### Custom Health Check Interval

Edit `docker-compose.yml`:
```yaml
healthcheck:
  interval: 10s  # Change this value
  timeout: 5s
  retries: 5
```

### Load Balancer Timeout

Edit `nginx/backend-lb.conf`:
```nginx
proxy_connect_timeout 5s;   # Connection timeout
proxy_send_timeout 10s;     # Send timeout
proxy_read_timeout 10s;     # Read timeout
```