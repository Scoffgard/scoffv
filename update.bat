@echo off
setlocal

set BASE_URL=https://cdn.rage.mp/updater/prerelease_server/server-files

echo Downloading files...

curl -o ragemp-server.exe %BASE_URL%/ragemp-server.exe
curl -o BugTrap-x64.dll %BASE_URL%/BugTrap-x64.dll
curl -o bin/bt.dat %BASE_URL%/bin/bt.dat
curl -o bin/enc.dat %BASE_URL%/bin/enc.dat
curl -o bin/loader.mjs %BASE_URL%/bin/loader.mjs

echo.
echo Done downloading all files!