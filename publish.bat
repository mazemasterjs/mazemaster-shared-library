@ECHO OFF
if "%1"=="pre" (
    echo "Pre-publish"

    if EXIST "bin" (
        echo "Clearing bin\ directory..."
        rmdir /s /q bin
    )

    echo "Compiling library..."
    tsc

    echo "Copying bin\*.js, bin\*.js.map, and src\*.ts to root..."
    copy bin\src\*.js .
    copy bin\src\*.js.map .
    copy src\*.ts .

    echo "Pre-publish complete."
)

if "%1"=="post" (
    echo "Post-publish"

    echo "Deleting .js, .ts, and .js.map files from root."
    del /q *.js
    del /q *.js.map

    echo "Post-publish complete."
)
