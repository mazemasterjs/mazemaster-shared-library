@ECHO OFF
echo "You must stop target project if running - including any watchers!"
echo "You will need to restart target projects for changes to take effect."
if EXIST "dist" (
    echo "Clearing dist\ directory"
    rmdir /s /q dist
)
mkdir dist

if EXIST "bin" (
    echo "Clearing bin\ directory"
    REM rmdir /s /q bin
)

echo "Compiling library"
tsc|rem

echo "Copying files in bin\ to dist\"
robocopy /MIR bin\ dist\



echo "Copying package files to dist\"
copy LICENSE dist\
copy package.json dist\
copy README.md dist\
copy .npmignore dist\

echo "Copying \dist to game-server modules folder"
robocopy /MIR dist\ ..\game-server\node_modules\@mazemasterjs\shared-library