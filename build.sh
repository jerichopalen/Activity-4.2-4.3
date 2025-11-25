#!/bin/bash
set -e
echo "Installing dependencies..."
npm ci --prefer-offline --no-audit
echo "Building project..."
npm run build
echo "Build complete!"
