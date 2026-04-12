#!/bin/bash

echo "🔧 Fixing file watcher limits..."
ulimit -n 65536

echo "🧹 Clearing Expo cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Clear watchman cache if installed
if command -v watchman &> /dev/null; then
  echo "🔄 Resetting Watchman..."
  watchman watch-del-all 2>/dev/null
  watchman shutdown-server 2>/dev/null
  sleep 1
fi

echo "🚀 Starting Expo..."
npx expo start -c
