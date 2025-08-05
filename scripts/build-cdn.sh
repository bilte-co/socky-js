#!/bin/bash

# Build script for CDN releases
set -e

VERSION=${1:-$(node -p "require('./package.json').version")}

echo "Building Socky.js v${VERSION} for CDN..."

# Clean and create directories
rm -rf dist cdn
mkdir -p dist cdn/v${VERSION} cdn/latest

# Build all variants
echo "Building minified version..."
bun build index.ts --outfile=dist/socky.min.js --production --minify --target=browser  --format=iife--sourcemap

echo "Building development version..."
bun build index.ts --outfile=dist/socky.js --production --target=browser --format=iife --sourcemap

echo "Building ESM version..."
bun build index.ts --outfile=dist/socky.esm.js --production --target=browser --format=esm --sourcemap

# Copy to CDN structure
echo "Creating CDN structure..."
cp dist/socky.min.js cdn/v${VERSION}/
cp dist/socky.min.js.map cdn/v${VERSION}/
cp dist/socky.js cdn/v${VERSION}/
cp dist/socky.js.map cdn/v${VERSION}/
cp dist/socky.esm.js cdn/v${VERSION}/
cp dist/socky.esm.js.map cdn/v${VERSION}/

cp dist/socky.min.js cdn/latest/
cp dist/socky.min.js.map cdn/latest/
cp dist/socky.js cdn/latest/
cp dist/socky.js.map cdn/latest/
cp dist/socky.esm.js cdn/latest/
cp dist/socky.esm.js.map cdn/latest/

echo "CDN build complete for v${VERSION}"
echo "Files available in:"
echo "  - cdn/v${VERSION}/"
echo "  - cdn/latest/"
