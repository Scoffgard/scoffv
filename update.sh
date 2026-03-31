#!/bin/sh

BASE_URL="https://cdn.rage.mp/updater/prerelease_server/server-files"
ARCHIVE_NAME="linux_x64.tar.gz"
TMP_DIR="ragemp_tmp"

echo "Downloading archive..."

curl -L -o "$ARCHIVE_NAME" "$BASE_URL/$ARCHIVE_NAME" || {
  echo "Download failed!"
  exit 1
}

echo "Extracting archive..."

mkdir -p "$TMP_DIR"
tar -xzf "$ARCHIVE_NAME" -C "$TMP_DIR" || {
  echo "Extraction failed!"
  exit 1
}

echo "Moving files..."

mv "$TMP_DIR/ragemp-srv/ragemp-server" ./ || {
  echo "Failed to move ragemp-server"
  exit 1
}

mkdir -p bin

mv "$TMP_DIR/ragemp-srv/bin/"* ./bin/ || {
  echo "Failed to move bin files"
  exit 1
}

chmod +x ragemp-server

echo "Cleaning up..."

rm -rf "$TMP_DIR"
rm -f "$ARCHIVE_NAME"

echo ""
echo "Done! Server is ready."