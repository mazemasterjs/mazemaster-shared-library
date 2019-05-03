@ECHO OFF

if EXIST "dist" (
    echo "Clearing dist\ directory"
    rmdir /s /q dist
)
mkdir dist

if EXIST "bin" (
    echo "Clearing bin\ directory"
    rmdir /s /q bin
)

echo "Compiling library"
tsc|rem

echo "Copying files in bin\ to dist\"
copy bin\*.* dist\

echo "Copying package files to dist\"
copy LICENSE dist\
copy package.json dist\
copy README.md dist\
