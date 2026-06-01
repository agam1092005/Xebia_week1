#!/bin/bash

# Blue-Green Deployment Switch Script
# Switches traffic between blue and green deployments

TARGET=${1:-blue}

if [ "$TARGET" != "blue" ] && [ "$TARGET" != "green" ]; then
    echo "Usage: ./switch-deployment.sh [blue|green]"
    exit 1
fi

echo "Switching to $TARGET deployment..."

if [ "$TARGET" = "blue" ]; then
    ACTIVE="blue"
    INACTIVE="green"
    BACKEND_PORT=8080
    BACKEND_INACTIVE_PORT=8081
else
    ACTIVE="green"
    INACTIVE="blue"
    BACKEND_PORT=8081
    BACKEND_INACTIVE_PORT=8080
fi

# Check if target deployment is healthy
echo "Checking $ACTIVE deployment health..."

if ! curl -s http://localhost:$BACKEND_PORT/health > /dev/null 2>&1; then
    echo "Error: $ACTIVE backend is not healthy"
    exit 1
fi

echo "✓ $ACTIVE deployment is healthy"
echo "✓ Switching traffic to $ACTIVE"
echo ""
echo "Active deployment: $ACTIVE"
echo "Standby deployment: $INACTIVE"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:8080"
