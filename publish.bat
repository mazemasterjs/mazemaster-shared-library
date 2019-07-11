@ECHO OFF

if EXIST "dist" (
    echo "Clearing dist\ directory"
    rmdir /s /q dist
)
mkdir dist
mkdir dist\Interfaces

if EXIST "bin" (
    echo "Clearing bin\ directory"
    REM rmdir /s /q bin
)

echo "Compiling library"
tsc|rem

echo "Copying files in bin\ to dist\"
copy bin\*.* dist\
copy bin\Interfaces\*.* dist\Interfaces\

echo "Copying package files to dist\"
copy LICENSE dist\
copy package.json dist\
copy README.md dist\
copy .npmignore dist\


if "%~1" neq "--package-only" (
    echo Publishing module...
    npm publish dist|rem
) else (
    echo "--package-only" flag set, publish skipped.
)
