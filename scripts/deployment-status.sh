#!/bin/bash

# Deployment Status Script
# Shows which deployment (blue/green) is currently active

echo "=========================================="
echo "Deployment Status"
echo "=========================================="
echo ""

# Check backend deployments
echo "Backend Status:"
echo "  Blue (port 8080):"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "    ✓ Healthy"
else
    echo "    ✗ Unhealthy"
fi

echo "  Green (port 8081):"
if curl -s http://localhost:8081/health > /dev/null 2>&1; then
    echo "    ✓ Healthy"
else
    echo "    ✗ Unhealthy"
fi

echo ""
echo "Frontend Status:"
echo "  Blue:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "    ✓ Healthy"
else
    echo "    ✗ Unhealthy"
fi

echo "  Green:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "    ✓ Healthy"
else
    echo "    ✗ Unhealthy"
fi

echo ""
echo "Load Balancer:"
echo "  Backend LB (port 8080): http://localhost:8080"
echo "  Frontend LB (port 3000): http://localhost:3000"
echo ""
echo "=========================================="
