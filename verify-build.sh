#!/bin/bash

echo "🔍 Verifying WebPolyglot project..."
echo ""

# Test main project
echo "📦 Building main package..."
npm run build
if [ $? -eq 0 ]; then
  echo "✅ Main package build successful"
else
  echo "❌ Main package build failed"
  exit 1
fi

echo ""
echo "🧪 Running tests..."
npm test
if [ $? -eq 0 ]; then
  echo "✅ Tests passed"
else
  echo "❌ Tests failed"
  exit 1
fi

echo ""
echo "📦 Building CLI..."
cd cli && npm run build
if [ $? -eq 0 ]; then
  echo "✅ CLI build successful"
else
  echo "❌ CLI build failed"
  exit 1
fi

echo ""
echo "🎉 All checks passed!"
