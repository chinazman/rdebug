#!/bin/bash

echo "=== Debug Build Script ==="
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Current directory: $(pwd)"

echo "=== File Structure ==="
ls -la

echo "=== Source Structure ==="
ls -la src/

echo "=== Components Structure ==="
ls -la src/components/ui/

echo "=== TypeScript Config ==="
cat tsconfig.json

echo "=== Next.js Config ==="
cat next.config.js

echo "=== Package.json ==="
cat package.json

echo "=== Installing Dependencies ==="
npm ci

echo "=== Generating Prisma Client ==="
npx prisma generate

echo "=== Building Application ==="
npm run build

echo "=== Build Complete ===" 