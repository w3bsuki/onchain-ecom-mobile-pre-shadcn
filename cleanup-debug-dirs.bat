@echo off
echo Deleting debug and demo directories...

if exist "src\app\debug" rmdir /s /q "src\app\debug"
if exist "src\app\medusa-debug" rmdir /s /q "src\app\medusa-debug"
if exist "src\app\image-debug" rmdir /s /q "src\app\image-debug"
if exist "src\app\image-proxy-test" rmdir /s /q "src\app\image-proxy-test"
if exist "src\app\image-test" rmdir /s /q "src\app\image-test"
if exist "src\app\demos" rmdir /s /q "src\app\demos"
if exist "src\app\icons-demo" rmdir /s /q "src\app\icons-demo"

echo Cleanup complete! 