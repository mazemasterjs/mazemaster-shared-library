Remove-Item -Force -R ./bin
tsc
mkdir ./dist
Copy-Item ./bin/src/*.js .
Copy-Item ./bin/src/*.js.map .
Copy-Item ./src/*.ts .

npm publish 

Remove-Item ./*.js
Remove-Item ./*.js.map
Remove-Item ./*.ts
