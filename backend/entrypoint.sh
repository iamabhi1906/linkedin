#!/bin/sh
set -e

echo "Running migrations..."
pnpm migration:run

echo "Running seeders..."
pnpm seed

echo "Starting NestJS..."
exec node dist/main.js