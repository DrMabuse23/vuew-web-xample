build webc : 

````
cd component
./node_modules/.bin/vue-cli-service build --target wc --name data-table ./src/main.ts
````

copy from dist to application public !!! no automatization!!!

run application

````
cd application
npm run serve
````


