Remove-Item -Force -R ./dist
Remove-Item -Force -R ./bin
tsc
mkdir ./dist
Copy-Item ./bin/src/*.js ./dist/
Copy-Item ./bin/src/*.js.map ./dist/
Copy-Item ./src/*.ts ./dist/